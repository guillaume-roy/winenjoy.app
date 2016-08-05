import {WineTasting} from "../entities/wineTasting";
import appSettings = require("application-settings");
import {User} from "../entities/user";
import {UserStats} from "../entities/userStats";
import {UUID} from "../utils/uuid";
import _ = require("lodash");
import firebase = require("nativescript-plugin-firebase");
import {UserService} from "./userService";
import fs = require("file-system");

export class TastingsService {
    private static TASTINGS_KEY = "TASTINGS";
    private _userService: UserService;
    private _userId: string;

    constructor() {
        this._userService = new UserService();
        this._userId = this._userService.getUser().uid;
    }

    public newTasting() {
        return <WineTasting>{
            alcohol: null,
            aoc: null,
            aromas: [],
            attacks: [],
            balances: [],
            hasBubbles: false,
            hasDeposit: false,
            color: null,
            country: null,
            cuvee: null,
            defects: [],
            endDate: null,
            estate: null,
            finalRating: 2,
            flavorDefects: [],
            flavors: [],
            grapes: [],
            id: null,
            intensities: [],
            isBiodynamic: false,
            isBiologic: false,
            isBlindTasting: false,
            lastModificationDate: null,
            length: [],
            limpidities: [],
            meatsNotes: null,
            picture: null,
            region: null,
            shines: [],
            sightTabNotes: null,
            smellTabNotes: null,
            startDate: Date.now(),
            synthesisTabNotes: null,
            tasteTabNotes: null,
            tears: [],
            wineTabNotes: null,
            wineType: null,
            year: null
        };
    }

    public getTasting(wineTastingId: string) {
        return new Promise<WineTasting>((resolve, reject) => {
            this.getTastings()
                .then(tastings => {
                    resolve(_.find(tastings, t => t.id === wineTastingId));
                });
        });
    }

    public getTastings(): Promise<WineTasting[]> {
        return new Promise<WineTasting[]>((resolve, reject) => {
            resolve(_.orderBy(<WineTasting[]>JSON.parse(appSettings.getString(TastingsService.TASTINGS_KEY, "[]")), ["endDate"], ["desc"]));
        });
    }

    public saveTasting(wineTasting: WineTasting, wineTastingPicturePath: string) {
        return new Promise<boolean>((resolve, reject) => {
            this.saveTastingOnFirebase(wineTasting).then(newTasting => {
                this.saveTastingPictureOnFirebase(newTasting.id, wineTastingPicturePath).then(() => {
                    this._userService.increaseUserStats(newTasting).then(() => {
                        this.saveTastingLocally(newTasting).then(() => resolve(true));
                    });
                });
            });
        });
    }

    public deleteTasting(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
            var endOfDelete = () => {
                this.deleteTastingOnFirebase(wineTasting).then(() => {
                    this._userService.decreaseUserStats(wineTasting).then(() => {
                        this.deleteTastingLocally(wineTasting.id).then(() => resolve(true));
                    });
                });
            };

            if (wineTasting.containsPicture) {
                this.deleteTastingPictureOnFirebase(wineTasting.id).then(() => endOfDelete());
            } else {
                endOfDelete();
            }
        });
    }

    public updateTasting(wineTasting: WineTasting, wineTastingPicturePath: string, pictureEditMode: string) {
        return new Promise<boolean>((resolve, reject) => {
            this.updateTastingOnFirebase(wineTasting).then(() => {
                var endOfUpdate = () => {
                    this.getTasting(wineTasting.id).then(oldWineTasting => {
                        this._userService.decreaseUserStats(oldWineTasting).then(() => {
                            this._userService.increaseUserStats(wineTasting).then(() => {
                                this.updateTastingLocally(wineTasting).then(() => resolve(true));
                            });
                        });
                    });
                };
                switch (pictureEditMode) {
                    case "EDIT":
                        this.saveTastingPictureOnFirebase(wineTasting.id, wineTastingPicturePath).then(endOfUpdate);
                        break;
                    case "DELETE":
                        this.deleteTastingPictureOnFirebase(wineTasting.id).then(endOfUpdate);
                        break;
                    default:
                        endOfUpdate();
                        break;
                }
            });
        });
    }

    public getTastingPictureUrl(wineTastingId) {
        return new Promise<string>((resolve, reject) => {
            firebase.getDownloadUrl({
                remoteFullPath: `/tastings/${this._userId}/${wineTastingId}`
            }).then(url => resolve(url));
        });
    }

    public saveTastings(wineTastings: WineTasting[]) {
        appSettings.setString(TastingsService.TASTINGS_KEY, JSON.stringify(wineTastings));
    }

    private deleteTastingOnFirebase(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.remove(`/tastings/${this._userId}/${wineTasting.id}`)
                .then(() => resolve(true));
        });
    }

    private deleteTastingPictureOnFirebase(wineTastingId: string) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.deleteFile({
                remoteFullPath: `/tastings/${this._userId}/${wineTastingId}`
            }).then(() => {
                resolve(true);
            });
        });
    }

    private deleteTastingLocally(wineTastingId) {
        return new Promise<boolean>((resolve, reject) => {
            this.getTastings().then(tastings => {
                _.remove(tastings, w => w.id === wineTastingId);
                this.saveTastings(tastings);
                resolve(true);
            });
        });
    }

    private updateTastingOnFirebase(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
            wineTasting.lastModificationDate = Date.now();
            firebase.setValue(`/tastings/${this._userId}/${wineTasting.id}`, wineTasting)
                .then(() => resolve(true));
        });
    }

    private updateTastingLocally(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
            this.deleteTastingLocally(wineTasting.id).then(() => {
                this.saveTastingLocally(wineTasting).then(() => resolve(true));
            });
        });
    }

    private saveTastingLocally(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
            this.getTastings().then(tastings => {
                tastings.push(wineTasting);
                this.saveTastings(tastings);
                resolve(true);
            });
        });
    }

    private saveTastingOnFirebase(wineTasting: WineTasting) {
        return new Promise<WineTasting>(resolve => {
            wineTasting.endDate = Date.now();
            firebase.push(`/tastings/${this._userId}`, {})
                .then(res => {
                    wineTasting.id = res.key;
                    firebase.setValue(`/tastings/${this._userId}/${wineTasting.id}`, wineTasting)
                        .then(() => resolve(wineTasting));
                });
        });
    }

    private saveTastingPictureOnFirebase(wineTastingId, wineTastingPicture) {
        return new Promise<boolean>((resolve, reject) => {
            if (_.isEmpty(wineTastingPicture)) {
                resolve(true);
            }
            firebase.uploadFile({
                localFile: fs.File.fromPath(wineTastingPicture),
                remoteFullPath: `/tastings/${this._userId}/${wineTastingId}`
            }).then(() => resolve(true));
        });
    }
}