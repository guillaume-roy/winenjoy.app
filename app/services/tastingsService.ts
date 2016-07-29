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
                altitude: null,
                aoc: null,
                aromas: [],
                attacks: [],
                balances: [],
                bubbles: [],
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
                latitude: null,
                length: [],
                limpidities: [],
                longitude: null,
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

    public getTastings(): Promise<WineTasting[]> {
        return new Promise<WineTasting[]>((resolve, reject) => {
            resolve(_.orderBy(<WineTasting[]>JSON.parse(appSettings.getString(TastingsService.TASTINGS_KEY, "[]")), ["endDate"], ["desc"]));
        });
    }

    // public saveTasting(wineTasting: WineTasting, wineTastingPicturePath: string): Promise<boolean> {
    //     return new Promise<boolean>((resolve, reject) => {
    //         this.getTastings().then(wineTastings => {
    //             if (_.isEmpty(wineTasting.id)) {
    //                 wineTasting.id = UUID.generate();
    //                 wineTasting.endDate = Date.now();
    //                 wineTastings.push(wineTasting);
    //                 this.saveTastings(wineTastings);
    //                 this.saveTastingOnFirebase(wineTasting, wineTastingPicturePath);
    //                 resolve(true);
    //             } else {
    //                 this.deleteTasting(wineTasting).then(result => {
    //                     this.getTastings().then(tastings => {
    //                         wineTasting.lastModificationDate = Date.now();
    //                         tastings.push(wineTasting);
    //                         this.saveTastings(tastings);
    //                         resolve(true);
    //                     });
    //                 });
    //             }
    //         });
    //     });
    // }

    public saveTasting(wineTasting: WineTasting, wineTastingPicturePath: string) {
        return new Promise<boolean>((resolve, reject) => {
            this.saveTastingOnFirebase(wineTasting)
            .then(newTasting => {
                this.saveTastingPictureOnFirebase(newTasting.id, wineTastingPicturePath)
                .then(() => {
                    this._userService.increaseUserStats(newTasting);
                });
            });
        });
    }

    public deleteTasting(wineTasting: WineTasting): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getTastings().then(wineTastings => {
                _.remove(wineTastings, w => w.id === wineTasting.id);
                this.saveTastings(wineTastings);
                resolve(true);
            });
        });
    }

    public deleteTastingOnFirebase(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
            let userId = this._userService.getUser().uid;
            firebase.remove(`/tastings/${userId}/${wineTasting.id}`)
            .then(() => {
                this.deleteTastingPictureOnFirebase(wineTasting.id)
                .then(() => {
                    this._userService.decreaseUserStats(wineTasting);
                });
            });
        });
    }

    public saveTastings(wineTastings: WineTasting[]) {
        appSettings.setString(TastingsService.TASTINGS_KEY, JSON.stringify(wineTastings));
    }

    private deleteTastingPictureOnFirebase(wineTastingId: string) {
        return new Promise<boolean>((resolve, reject) => {
            let userId = this._userService.getUser().uid;
            firebase.deleteFile({
                remoteFullPath: "/tastings/" + userId + "/" + wineTastingId
            }).then(() => {
                resolve(true);
            });
        });
    }

    private updateTastingOnFirebase(wineTasting: WineTasting, wineTastingPicturePath: string) {
        return new Promise<boolean>((resolve, reject) => {
            let userId = this._userService.getUser().uid;
            firebase.setValue("/tastings/" + userId + "/" + wineTasting.id, wineTasting)
            .then(() => {
                if (_.isEmpty(wineTastingPicturePath)) {
                    this.deleteTastingPictureOnFirebase(wineTasting.id);
                } else {
                    this.saveTastingPictureOnFirebase(wineTasting.id, wineTastingPicturePath);
                }
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
            }).then(res => {
                resolve(true);
            });
        });
    }
}
