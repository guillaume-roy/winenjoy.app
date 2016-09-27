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

    constructor(userId?: string) {
        if (!_.isEmpty(userId)) {
            this._userId = userId;
        } else {
            this._userService = new UserService();

            let user = this._userService.getUser();
            if (user) {
                this._userId = user.uid;
            }
        }
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
                    resolve(_.find(tastings, { id: wineTastingId }));
                }).catch(error => {
                    reject({
                        error: error,
                        message: "Error in TastingsService.getTasting"
                    });
                });
        });
    }

    public getTastings(): Promise<WineTasting[]> {
        return new Promise<WineTasting[]>((resolve, reject) => {
            try {
                resolve(_.orderBy(<WineTasting[]>JSON.parse(appSettings.getString(TastingsService.TASTINGS_KEY, "[]")),
                    ["endDate"],
                    ["desc"]));
            }
            catch (error) {
                reject({
                    error: error,
                    message: "Error in TastingsService.getTastings"
                });
            }
        });
    }

    public saveTasting(wineTasting: WineTasting, wineTastingPicturePath: string) {
        return new Promise<boolean>((resolve, reject) => {
            this.saveTastingOnFirebase(wineTasting).then(newTasting => {
                this.saveTastingPictureOnFirebase(newTasting.id, wineTastingPicturePath).then(() => {
                    this._userService.increaseUserStats(newTasting).then(() => {
                        this.saveTastingLocally(newTasting)
                            .then(() => resolve(true))
                            .catch(saveTastingLocallyError => reject(saveTastingLocallyError));
                    }).catch(increaseUserStatsError => reject(increaseUserStatsError));
                }).catch(saveTastingPictureOnFirebase => reject(saveTastingPictureOnFirebase));
            }).catch(saveTastingOnFirebaseError => reject(saveTastingOnFirebaseError));
        });
    }

    public deleteTasting(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
            var endOfDelete = () => {
                this.deleteTastingOnFirebase(wineTasting).then(() => {
                    this._userService.decreaseUserStats(wineTasting).then(() => {
                        this.deleteTastingLocally(wineTasting.id).then(() => resolve(true))
                            .catch(deleteTastingLocallyError => reject(deleteTastingLocallyError));
                    }).catch(decreaseUserStatsError => reject(decreaseUserStatsError));
                }).catch(deleteTastingOnFirebaseError => reject(deleteTastingOnFirebaseError));
            };

            if (wineTasting.containsPicture) {
                this.deleteTastingPictureOnFirebase(wineTasting.id)
                    .then(() => endOfDelete())
                    .catch(deleteTastingPictureOnFirebaseError => reject(deleteTastingPictureOnFirebaseError));
            } else {
                endOfDelete();
            }
        });
    }

    public updateTasting(wineTasting: WineTasting, wineTastingPicturePath?: string, pictureEditMode?: string) {
        return new Promise<boolean>((resolve, reject) => {
            this.updateTastingOnFirebase(wineTasting).then(() => {
                var endOfUpdate = () => {
                    this.getTasting(wineTasting.id).then(oldWineTasting => {
                        this._userService.decreaseUserStats(oldWineTasting).then(() => {
                            this._userService.increaseUserStats(wineTasting).then(() => {
                                this.updateTastingLocally(wineTasting).then(() => resolve(true))
                                    .catch(updateTastingLocallyError => reject(updateTastingLocallyError));
                            }).catch(increaseUserStatsError => reject(increaseUserStatsError));
                        }).catch(decreaseUserStatsError => reject(decreaseUserStatsError));
                    }).catch(getTastingError => reject(getTastingError));
                };
                switch (pictureEditMode) {
                    case "EDIT":
                        this.saveTastingPictureOnFirebase(wineTasting.id, wineTastingPicturePath)
                            .then(endOfUpdate)
                            .catch(saveTastingPictureOnFirebaseError => reject(saveTastingPictureOnFirebaseError));
                        break;
                    case "DELETE":
                        this.deleteTastingPictureOnFirebase(wineTasting.id)
                            .then(endOfUpdate)
                            .catch(deleteTastingPictureOnFirebaseError => reject(deleteTastingPictureOnFirebaseError));
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
            })
                .then(url => resolve(url))
                .catch(error => reject({
                    error: error,
                    message: "Error in TastingsService.getTastingPictureUrl"
                }));
        });
    }

    public saveTastingsLocally(wineTastings: WineTasting[]) {
        appSettings.setString(TastingsService.TASTINGS_KEY, JSON.stringify(wineTastings));
    }

    private deleteTastingOnFirebase(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.remove(`/tastings/${this._userId}/${wineTasting.id}`)
                .then(() => resolve(true))
                .catch(removeError => {
                    reject({
                        error: removeError,
                        message: "Error in TastingsService.deleteTastingOnFirebase"
                    });
                });
        });
    }

    private deleteTastingPictureOnFirebase(wineTastingId: string) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.deleteFile({
                remoteFullPath: `/tastings/${this._userId}/${wineTastingId}`
            }).then(() => {
                resolve(true);
            }).catch(deleteFileError => {
                reject({
                    error: deleteFileError,
                    message: "Error in TastingsService.deleteTastingPictureOnFirebase"
                });
            });
        });
    }

    private deleteTastingLocally(wineTastingId) {
        return new Promise<boolean>((resolve, reject) => {
            this.getTastings().then(tastings => {
                try {
                    _.remove(tastings, w => w.id === wineTastingId);
                    this.saveTastingsLocally(tastings);
                    resolve(true);
                } catch (error) {
                    reject({
                        error: error,
                        message: "Error in TastingsService.deleteTastingLocally"
                    });
                }
            }).catch(e => reject(e));
        });
    }

    private updateTastingOnFirebase(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.setValue(`/tastings/${this._userId}/${wineTasting.id}`, wineTasting)
                .then(() => resolve(true))
                .catch(e => reject({
                    error: e,
                    message: "Error in TastingsService.updateTastingOnFirebase"
                }));
        });
    }

    private updateTastingLocally(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
            this.deleteTastingLocally(wineTasting.id)
                .then(() => {
                    this.saveTastingLocally(wineTasting)
                        .then(() => resolve(true))
                        .catch(e => reject(e));
                })
                .catch(e1 => reject(e1));
        });
    }

    private saveTastingLocally(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
            this.getTastings().then(tastings => {
                try {
                    tastings.unshift(wineTasting);
                    this.saveTastingsLocally(tastings);
                    resolve(true);
                } catch (error) {
                    reject({
                        error: error,
                        message: "Error in TastingsService.saveTastingLocally"
                    });
                }
            }).catch(e => reject(e));
        });
    }

    private saveTastingOnFirebase(wineTasting: WineTasting) {
        return new Promise<WineTasting>((resolve, reject) => {
            firebase.push(`/tastings/${this._userId}`, {})
                .then(res => {
                    wineTasting.id = res.key;
                    firebase.setValue(`/tastings/${this._userId}/${wineTasting.id}`, wineTasting)
                        .then(() => resolve(wineTasting))
                        .catch(setValueError => reject({
                            error: setValueError,
                            message: "Error in TastingsService.saveTastingOnFirebase.setValue"
                        }));
                })
                .catch(pushError => reject({
                    error: pushError,
                    message: "Error in TastingsService.saveTastingOnFirebase.push"
                }));
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
            }).then(() => resolve(true))
                .catch(error => reject({
                    error: error,
                    message: "Error in TastingsService.saveTastingPictureOnFirebase"
                }));
        });
    }

    loadTastings() {
        return new Promise<boolean>((resolve, reject) => {
            firebase.query(
                data => {
                    var tastings = _.toArray(data.value || []);
                    this.saveTastingsLocally(_.orderBy(tastings, ['tastingDate'], ['desc']));
                    resolve(true);
                },
                `/tastings/${this._userId}`,
                {
                    orderBy: {
                        type: firebase.QueryOrderByType.CHILD,
                        value: "tastingDate"
                    },
                    singleEvent: true
                }).catch(error => {
                    reject({
                        error: error,
                        message: "Error in TastingsService.loadTastings"
                    });
                });
        });
    }
}