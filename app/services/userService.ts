import {WineTasting} from "../entities/wineTasting";
import {User} from "../entities/user";
import {UserStats} from "../entities/userStats";
import appSettings = require("application-settings");
import firebase = require("nativescript-plugin-firebase");
import {Config} from "../utils/config";
import appversion = require("nativescript-appversion");
import {TastingsService} from "./tastingsService";
import _ = require("lodash");

export class UserService {
    private static USER_KEY = "USER";
    private static USER_STATS_KEY = "USER_STATS";

    public getUser() {
        return <User>JSON.parse(appSettings.getString(UserService.USER_KEY, null));
    }

    public setUser(value: User) {
        appSettings.setString(UserService.USER_KEY, JSON.stringify(value));
    }

    public getUserStats() {
        return <UserStats>JSON.parse(appSettings.getString(UserService.USER_STATS_KEY, null));
    }

    public setUserStats(value: UserStats) {
        appSettings.setString(UserService.USER_STATS_KEY, JSON.stringify(value));
    }

    public initAuthentication() {
        return new Promise<boolean>((resolve, reject) => {
            let config = new Config();
            firebase.init({
                onAuthStateChanged: (data: any) => {
                    if (data.loggedIn) {
                        resolve(true);
                    } else {
                        this.setUser(null);
                        resolve(false);
                    }
                },
                storageBucket: config.FirebaseStorageBucket
            }).catch(error => {
                reject({
                    error: error,
                    message: "Error in UserService.initAuthentication"
                });
            });
        });
    }

    public login(email: string, password: string) {
        return firebase.login({
            email: email,
            password: password,
            type: firebase.LoginType.PASSWORD
        }).then(res => {
            return this.loadUserProfile(res.uid)
                .then(() => {
                    this.updateLastConnectionDate();
                    this.loadUserStats(res.uid)
                        .then(() => {
                            var tastingsService = new TastingsService(res.uid);
                            return tastingsService.loadTastings();
                        });
                });
        }).catch(error => {
            throw {
                error: error,
                message: "Error in UserService.login"
            };
        });
    }

    public signup(email: string, password: string) {
        return firebase.createUser({
            email: email,
            password: password
        }).then((res: any) => {
            return Promise.all([this.createUserProfile(email, res.uid), this.createUserStats(res.uid)]);
        }).catch(createUserError => {
            throw {
                error: createUserError,
                message: "Error in UserService.signup"
            };
        });
    }

    public forgotPassword(email: string) {
        return firebase.resetPassword({
            email: email
        }).catch(error => {
            throw {
                error: error,
                message: "Error in UserService.forgotPassword"
            };
        });
    }

    public changePassword(email: string, oldPassword: string, newPassword: string) {
        return firebase.changePassword({
            email: email,
            newPassword: newPassword,
            oldPassword: oldPassword
        }).catch(err => {
            throw {
                error: err,
                message: "Error in UserService.changePassword"
            };
        });
    }

    public logout() {
        return firebase.logout().then(() => {
            this.setUser(null);
            this.setUserStats(null);
        });
    }

    public updateLastConnectionDate() {
        let user = this.getUser();
        user.lastConnectionDate = Date.now();
        return firebase.update("/users/" + user.uid, { lastConnectionDate: user.lastConnectionDate })
            .then(data => {
                this.setUser(user);
                return;
            })
            .catch(error => {
                throw {
                    error: error,
                    message: "Error in UserService.updateLastConnectionDate"
                };
            });
    }

    public decreaseUserStats(wineTasting: WineTasting) {
        try {
            let userStats = this.getUserStats();

            userStats.totalTastings -= 1;
            userStats.totalRatings -= wineTasting.finalRating;
            userStats.averageRating = userStats.totalTastings > 0
                ? userStats.totalRatings / userStats.totalTastings
                : 0;

            userStats.tastingsByRating = this
                .popCriteriaStat(userStats.tastingsByRating, wineTasting.finalRating, wineTasting.id);

            if (!_.isEmpty(wineTasting.wineType)) {
                userStats.tastingsByWineType = this
                    .popCriteriaStat(userStats.tastingsByWineType, wineTasting.wineType.code, wineTasting.id);
            }
            if (!_.isEmpty(wineTasting.estate)) {
                userStats.tastingsByEstate = this
                    .popCriteriaStat(userStats.tastingsByEstate, wineTasting.estate.toLowerCase(), wineTasting.id);
            }
            if (!_.isEmpty(wineTasting.region)) {
                userStats.tastingsByRegion = this
                    .popCriteriaStat(userStats.tastingsByRegion, wineTasting.region.id, wineTasting.id);
            }
            if (!_.isEmpty(wineTasting.name)) {
                userStats.tastingsByName = this
                    .popCriteriaStat(userStats.tastingsByName, wineTasting.name.toLowerCase(), wineTasting.id);
            }
            if (!_.isEmpty(wineTasting.country)) {
                userStats.tastingsByCountry = this
                    .popCriteriaStat(userStats.tastingsByCountry, wineTasting.country.id, wineTasting.id);
            }
            if (!_.isEmpty(wineTasting.aoc)) {
                userStats.tastingsByAoc = this
                    .popCriteriaStat(userStats.tastingsByAoc, wineTasting.aoc.id, wineTasting.id);
            }
            if (wineTasting.year) {
                userStats.tastingsByWineYear = this
                    .popCriteriaStat(userStats.tastingsByWineYear, wineTasting.year, wineTasting.id);
            }

            userStats.tastingsByIsBiodynamic = this.popCriteriaStat(
                userStats.tastingsByIsBiodynamic,
                wineTasting.isBiodynamic,
                wineTasting.id);
            userStats.tastingsByIsBlind = this
                .popCriteriaStat(userStats.tastingsByIsBlind, wineTasting.isBlindTasting, wineTasting.id);
            userStats.tastingsByBubble = this.popCriteriaStat(
                userStats.tastingsByBubble,
                wineTasting.hasBubbles,
                wineTasting.id);
            userStats.tastingsByTastingYear = this.popCriteriaStat(
                userStats.tastingsByTastingYear,
                new Date(wineTasting.tastingDate).getFullYear(),
                wineTasting.id);

            if (!_.isEmpty(wineTasting.grapes)) {
                for (let i = 0; i < wineTasting.grapes.length; i++) {
                    userStats.tastingsByGrape = this.popCriteriaStat(
                        userStats.tastingsByGrape,
                        wineTasting.grapes[i].id,
                        wineTasting.id);
                }
            }

            if (!_.isEmpty(wineTasting.aromas)) {
                for (let i = 0; i < wineTasting.aromas.length; i++) {
                    userStats.tastingsByAroma = this.popCriteriaStat(
                        userStats.tastingsByAroma,
                        wineTasting.aromas[i].id,
                        wineTasting.id);
                }
            }

            if (!_.isEmpty(wineTasting.defects)) {
                for (let i = 0; i < wineTasting.defects.length; i++) {
                    userStats.tastingsByAromaDefect = this.popCriteriaStat(
                        userStats.tastingsByAromaDefect,
                        wineTasting.defects[i].id,
                        wineTasting.id);
                }
            }

            if (!_.isEmpty(wineTasting.flavors)) {
                for (let i = 0; i < wineTasting.flavors.length; i++) {
                    userStats.tastingsByFlavor = this.popCriteriaStat(
                        userStats.tastingsByFlavor,
                        wineTasting.flavors[i].id,
                        wineTasting.id);
                }
            }

            if (!_.isEmpty(wineTasting.flavorDefects)) {
                for (let i = 0; i < wineTasting.flavorDefects.length; i++) {
                    userStats.tastingsByFlavorDefect = this.popCriteriaStat(
                        userStats.tastingsByFlavorDefect,
                        wineTasting.flavorDefects[i].id,
                        wineTasting.id);
                }
            }

            return this.updateUserStats(userStats);
        } catch (error) {
            return Promise.reject({
                error: error,
                message: "Error in UserService.decreaseUserStats"
            });
        }
    }

    public increaseUserStats(wineTasting: WineTasting) {
        try {
            let userStats = this.getUserStats();

            userStats.totalTastings += 1;
            userStats.totalRatings += wineTasting.finalRating;
            userStats.averageRating = userStats.totalRatings / userStats.totalTastings;

            userStats.tastingsByRating = this
                .pushCriteriaStat(userStats.tastingsByRating, wineTasting.finalRating, wineTasting.id);
            if (!_.isEmpty(wineTasting.wineType)) {
                userStats.tastingsByWineType = this
                    .pushCriteriaStat(userStats.tastingsByWineType, wineTasting.wineType.code, wineTasting.id);
            }
            if (!_.isEmpty(wineTasting.estate)) {
                userStats.tastingsByEstate = this
                    .pushCriteriaStat(userStats.tastingsByEstate, wineTasting.estate.toLowerCase(), wineTasting.id);
            }
            if (!_.isEmpty(wineTasting.region)) {
                userStats.tastingsByRegion = this
                    .pushCriteriaStat(userStats.tastingsByRegion, wineTasting.region.id, wineTasting.id);
            }
            if (!_.isEmpty(wineTasting.name)) {
                userStats.tastingsByName = this
                    .pushCriteriaStat(userStats.tastingsByName, wineTasting.name.toLowerCase(), wineTasting.id);
            }
            if (!_.isEmpty(wineTasting.country)) {
                userStats.tastingsByCountry = this
                    .pushCriteriaStat(userStats.tastingsByCountry, wineTasting.country.id, wineTasting.id);
            }
            if (!_.isEmpty(wineTasting.aoc)) {
                userStats.tastingsByAoc = this.pushCriteriaStat(userStats.tastingsByAoc,
                    wineTasting.aoc.id,
                    wineTasting.id);
            }
            if (wineTasting.year) {
                userStats.tastingsByWineYear = this
                    .pushCriteriaStat(userStats.tastingsByWineYear, wineTasting.year, wineTasting.id);
            }

            userStats.tastingsByIsBiodynamic = this.pushCriteriaStat(
                userStats.tastingsByIsBiodynamic,
                wineTasting.isBiodynamic,
                wineTasting.id);
            userStats.tastingsByIsBlind = this
                .pushCriteriaStat(userStats.tastingsByIsBlind, wineTasting.isBlindTasting, wineTasting.id);
            userStats.tastingsByBubble = this.pushCriteriaStat(
                userStats.tastingsByBubble,
                wineTasting.hasBubbles,
                wineTasting.id);
            userStats.tastingsByTastingYear = this.pushCriteriaStat(
                userStats.tastingsByTastingYear,
                new Date(wineTasting.tastingDate).getFullYear(),
                wineTasting.id);
            if (!_.isEmpty(wineTasting.grapes)) {
                for (let i = 0; i < wineTasting.grapes.length; i++) {
                    userStats.tastingsByGrape = this.pushCriteriaStat(
                        userStats.tastingsByGrape,
                        wineTasting.grapes[i].id,
                        wineTasting.id);
                }
            }
            if (!_.isEmpty(wineTasting.aromas)) {
                for (let i = 0; i < wineTasting.aromas.length; i++) {
                    userStats.tastingsByAroma = this.pushCriteriaStat(
                        userStats.tastingsByAroma,
                        wineTasting.aromas[i].id,
                        wineTasting.id);
                }
            }
            if (!_.isEmpty(wineTasting.defects)) {
                for (let i = 0; i < wineTasting.defects.length; i++) {
                    userStats.tastingsByAromaDefect = this.pushCriteriaStat(
                        userStats.tastingsByAromaDefect,
                        wineTasting.defects[i].id,
                        wineTasting.id);
                }
            }
            if (!_.isEmpty(wineTasting.flavors)) {
                for (let i = 0; i < wineTasting.flavors.length; i++) {
                    userStats.tastingsByFlavor = this.pushCriteriaStat(
                        userStats.tastingsByFlavor,
                        wineTasting.flavors[i].id,
                        wineTasting.id);
                }
            }
            if (!_.isEmpty(wineTasting.flavorDefects)) {
                for (let i = 0; i < wineTasting.flavorDefects.length; i++) {
                    userStats.tastingsByFlavorDefect = this.pushCriteriaStat(
                        userStats.tastingsByFlavorDefect,
                        wineTasting.flavorDefects[i].id,
                        wineTasting.id);
                }
            }

            return this.updateUserStats(userStats);
        } catch (error) {
            return Promise.reject({
                error: error,
                message: "Error in UserService.increaseUserStats"
            });
        }
    }

    public needToUpdateApp() {
        return firebase.getRemoteConfig(<any>{
            cacheExpirationSeconds: 60 * 60,
            properties: [
                {
                    key: "app_version",
                    default: "0"
                }
            ]
        }).then(res => {
            appversion.getVersionName()
                .then(localVersion => {
                    return localVersion !== res.properties["app_version"];
                })
                .catch(e => {
                    throw {
                        error: e,
                        message: "Error in UserService.needToUpdateApp.getVersionName"
                    }
                });
        }).catch(err => {
            throw {
                error: err,
                message: "Error in UserService.needToUpdateApp.getRemoteConfig"
            };
        });
    }

    private updateUserStats(userStats: UserStats) {
        let uid = this.getUser().uid;
        return firebase.setValue("/user_stats/" + uid, userStats)
            .then(data => {
                this.setUserStats(userStats);
                return;
            })
            .catch(setValueError => {
                throw {
                    error: setValueError,
                    message: "Error in UserService.updateUserStats"
                };
            });
    }

    private createUserProfile(email: string, uid: string) {
        let user = <User>{
            creationDate: Date.now(),
            email: email,
            lastConnectionDate: Date.now(),
            uid: uid
        };

        return firebase.setValue("/users/" + user.uid, user)
            .then(data => {
                this.setUser(user);
                return;
            })
            .catch(error => {
                throw {
                    error: error,
                    message: "Error in UserService.createUserProfile"
                };
            });
    }

    private createUserStats(uid: string) {
        let userStats = <UserStats>{
            averageRating: 0,
            tastingsByAoc: {},
            tastingsByAromaDefects: {},
            tastingsByAromas: {},
            tastingsByBubbles: {},
            tastingsByCountry: {},
            tastingsByName: {},
            tastingsByEstate: {},
            tastingsByFlavorDefects: {},
            tastingsByFlavors: {},
            tastingsByGrape: {},
            tastingsByIsBiodynamic: {},
            tastingsByIsBlind: {},
            tastingsByRating: {},
            tastingsByRegion: {},
            tastingsByTastingYear: {},
            tastingsByWineType: {},
            tastingsByWineYear: {},
            totalRatings: 0,
            totalTastings: 0,
            uid: uid
        };

        return firebase.setValue("/user_stats/" + uid, userStats)
            .then(data => {
                this.setUserStats(userStats);
                return;
            })
            .catch(setValueError => {
                throw {
                    error: setValueError,
                    message: "Error in UserService.createUserStats"
                };
            });
    }

    private loadUserProfile(uid: string) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.query(data => {
                this.setUser(data.value);
                resolve(true);
            },
                "/users/" + uid,
                {
                    orderBy: {
                        type: firebase.QueryOrderByType.VALUE
                    },
                    singleEvent: true
                }).catch(err => reject({
                    error: err,
                    message: "Error in UserService.loadUserProfile"
                }));
        });
    }

    private loadUserStats(uid: string) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.query(data => {
                this.setUserStats(data.value);
                resolve(true);
            },
                "/user_stats/" + uid,
                {
                    orderBy: {
                        type: firebase.QueryOrderByType.VALUE
                    },
                    singleEvent: true
                }).catch(err => reject({
                    error: err,
                    message: "Error in UserService.loadUserStats"
                }));
        });
    }

    private pushCriteriaStat(criteriaStat: { [id: string]: string[] }, code: any, wineTastingId: string) {
        try {
            if (_.isEmpty(criteriaStat)) {
                criteriaStat = {};
            }
            if (_.isEmpty(criteriaStat[code])) {
                criteriaStat[code] = [];
            }
            criteriaStat[code].push(wineTastingId);

            return criteriaStat;
        } catch (error) {
            throw {
                error: error,
                message: `Error in UserService.pushCriteriaStat for [${code}]`
            }
        }
    }

    private popCriteriaStat(criteriaStat: { [id: string]: string[] }, code: any, wineTastingId: string) {
        try {
            if (_.isEmpty(criteriaStat)) {
                criteriaStat = {};
            }
            if (_.isEmpty(criteriaStat[code])) {
                criteriaStat[code] = [];
            }

            _.remove(criteriaStat[code], v => v === wineTastingId);

            return criteriaStat;
        } catch (error) {
            throw {
                error: error,
                message: `Error in UserService.popCriteriaStat for [${code}]`
            }
        }
    }
}
