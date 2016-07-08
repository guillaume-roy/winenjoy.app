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

    constructor() {
        this._userService = new UserService();
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

    public saveTasting(wineTasting: WineTasting, wineTastingPicturePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getTastings().then(wineTastings => {
                if (_.isEmpty(wineTasting.id)) {
                    wineTasting.id = UUID.generate();
                    wineTasting.endDate = Date.now();
                    wineTastings.push(wineTasting);
                    this.saveTastings(wineTastings);
                    this.saveTastingOnFirebase(wineTasting, wineTastingPicturePath);
                    resolve(true);
                } else {
                    this.deleteTasting(wineTasting).then(result => {
                        this.getTastings().then(tastings => {
                            wineTasting.lastModificationDate = Date.now();
                            tastings.push(wineTasting);
                            this.saveTastings(tastings);
                            resolve(true);
                        });
                    });
                }
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

    public saveTastings(wineTastings: WineTasting[]) {
        appSettings.setString(TastingsService.TASTINGS_KEY, JSON.stringify(wineTastings));
    }

    private saveTastingOnFirebase(wineTasting: WineTasting, wineTastingPicturePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            wineTasting.id = UUID.generate();
            wineTasting.endDate = Date.now();

            let userId = this._userService.getUser().uid;
            firebase.push("/tastings/" + userId, wineTasting)
            .then(res => {
                this.updateUserStats(wineTasting);
                if (!_.isEmpty(wineTastingPicturePath)) {
                    this.saveTastingPictureOnFirebase(res.key, wineTastingPicturePath)
                    .then(() => resolve(true));
                } else {
                    resolve(true);
                }
            })
            .catch(error => {
                console.log("ERROR saveTastingOnFirebase : " + error);
                reject(error);
            });
        });
    }

    private saveTastingPictureOnFirebase(wineTastingId, wineTastingPicture) {
        return new Promise<boolean>((resolve, reject) => {
            let userId = this._userService.getUser().uid;
            firebase.uploadFile({
                localFile: fs.File.fromPath(wineTastingPicture),
                remoteFullPath: "tastings/" + userId + "/" + wineTastingId
            }).then(res => {
                resolve(true);
            }).catch(error => {
                console.log("ERROR saveTastingPictureOnFirebase : " + error);
                reject(error);
            });
        });
    }

    private fillCriteriaStat(criteriaStat: { [id: string]: string[] }, code: any, wineTastingId: string) {
        if (_.isEmpty(criteriaStat)) {
            criteriaStat = {};
        }
        if (_.isEmpty(criteriaStat[code])) {
            criteriaStat[code] = [];
        }
        criteriaStat[code].push(wineTastingId);

        return criteriaStat;
    }

    private updateUserStats(wineTasting: WineTasting) {
        let userStats = this._userService.getUserStats();

        userStats.totalTastings += 1;
        userStats.totalRatings += wineTasting.finalRating;
        userStats.averageRating = userStats.totalRatings / userStats.totalTastings;

        userStats.tastingsByWineType = this.fillCriteriaStat(userStats.tastingsByWineType, wineTasting.wineType.code, wineTasting.id);
        userStats.tastingsByRating = this.fillCriteriaStat(userStats.tastingsByRating, wineTasting.finalRating, wineTasting.id);
        userStats.tastingsByEstate = this.fillCriteriaStat(userStats.tastingsByEstate, wineTasting.estate, wineTasting.id);
        userStats.tastingsByRegion = this.fillCriteriaStat(userStats.tastingsByRegion, wineTasting.region.code, wineTasting.id);
        userStats.tastingsByCuvee = this.fillCriteriaStat(userStats.tastingsByCuvee, wineTasting.cuvee, wineTasting.id);
        userStats.tastingsByCountry = this.fillCriteriaStat(userStats.tastingsByCountry, wineTasting.country.code, wineTasting.id);
        userStats.tastingsByAoc = this.fillCriteriaStat(userStats.tastingsByAoc, wineTasting.aoc.code, wineTasting.id);
        userStats.tastingsByWineYear = this.fillCriteriaStat(userStats.tastingsByWineYear, wineTasting.year, wineTasting.id);
        userStats.tastingsByIsBiological = this.fillCriteriaStat(userStats.tastingsByIsBiological, wineTasting.isBiologic, wineTasting.id);
        userStats.tastingsByIsBiodynamic = this.fillCriteriaStat(
            userStats.tastingsByIsBiodynamic, wineTasting.isBiodynamic, wineTasting.id);
        userStats.tastingsByIsBlind = this.fillCriteriaStat(userStats.tastingsByIsBlind, wineTasting.isBlindTasting, wineTasting.id);
        userStats.tastingsByBubbles = this.fillCriteriaStat(
            userStats.tastingsByBubbles, (!_.isEmpty(wineTasting.bubbles) && wineTasting.bubbles.length > 0), wineTasting.id);
        userStats.tastingsByTastingYear = this.fillCriteriaStat(
            userStats.tastingsByTastingYear, new Date(wineTasting.startDate).getFullYear(), wineTasting.id);

        if (!_.isEmpty(wineTasting.grapes)) {
            for (let i = 0; i < wineTasting.grapes.length; i++) {
                userStats.tastingsByGrape = this.fillCriteriaStat(
                    userStats.tastingsByGrape, wineTasting.grapes[i].code, wineTasting.id);
            }
        }

        if (!_.isEmpty(wineTasting.aromas)) {
            for (let i = 0; i < wineTasting.aromas.length; i++) {
                userStats.tastingsByAromas = this.fillCriteriaStat(
                    userStats.tastingsByAromas, wineTasting.aromas[i].code, wineTasting.id);
            }
        }

        if (!_.isEmpty(wineTasting.defects)) {
            for (let i = 0; i < wineTasting.defects.length; i++) {
                userStats.tastingsByAromaDefects = this.fillCriteriaStat(
                    userStats.tastingsByAromaDefects, wineTasting.defects[i].code, wineTasting.id);
            }
        }

        if (!_.isEmpty(wineTasting.flavors)) {
            for (let i = 0; i < wineTasting.flavors.length; i++) {
                userStats.tastingsByFlavors = this.fillCriteriaStat(
                    userStats.tastingsByFlavors, wineTasting.flavors[i].code, wineTasting.id);
            }
        }

        if (!_.isEmpty(wineTasting.flavorDefects)) {
            for (let i = 0; i < wineTasting.flavorDefects.length; i++) {
                userStats.tastingsByFlavorDefects = this.fillCriteriaStat(
                    userStats.tastingsByFlavorDefects, wineTasting.flavorDefects[i].code, wineTasting.id);
            }
        }

        this._userService.updateUserStats(userStats);
    }
}
