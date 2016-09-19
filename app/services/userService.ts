import {WineTasting} from "../entities/wineTasting";
import {User} from "../entities/user";
import {UserStats} from "../entities/userStats";
import appSettings = require("application-settings");
import firebase = require("nativescript-plugin-firebase");
import {Config} from "../utils/config";
import appversion = require("nativescript-appversion");
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
                console.log("ERROR firebase init : " + error);
                reject(error);
            });
        });
    }

    public login(email: string, password: string) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.login({
                email: email,
                password: password,
                type: firebase.LoginType.PASSWORD
            }).then(res => {
                Promise.all([this.loadUserProfile(res.uid).then(() => this.updateLastConnectionDate()), this.loadUserStats(res.uid)])
                    .then(() => {
                        resolve(true);
                    });
            }).catch(error => {
                console.log("ERROR firebase login : " + error);
                reject(error);
            });
        });
    }

    public signup(email: string, password: string) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.createUser({
                email: email,
                password: password
            }).then((res: any) => {
                Promise.all([this.createUserProfile(email, res.uid), this.createUserStats(res.uid)])
                    .then(() => {
                        resolve(true);
                    });
            }).catch(createUserError => {
                console.log("ERROR firebase createUser : " + createUserError);
                reject(createUserError);
            });
        });
    }

    public forgotPassword(email: string) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.resetPassword({
                email: email
            }).then(res => {
                resolve(true);
            }).catch(error => {
                console.log("ERROR firebase resetPassword : " + error);
                reject(error);
            });
        });
    }

    public changePassword(email: string, oldPassword: string, newPassword: string) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.changePassword({
                email: email,
                newPassword: newPassword,
                oldPassword: oldPassword
            }).then(res => {
                resolve(true);
            }).catch(err => {
                console.log("ERROR firebase changePassword : " + err);
                reject(err);
            });
        });
    }

    public logout() {
        return new Promise<boolean>((resolve, reject) => {
            firebase.logout();
            this.setUser(null);
            this.setUserStats(null);
            resolve(true);
        });
    }

    public updateLastConnectionDate() {
        return new Promise<boolean>((resolve, reject) => {
            let user = this.getUser();
            user.lastConnectionDate = Date.now();
            firebase.update("/users/" + user.uid, { lastConnectionDate: user.lastConnectionDate })
                .then(data => {
                    this.setUser(user);
                    resolve(true);
                })
                .catch(error => {
                    console.log("ERROR firebase updateLastConnectionDate : " + error);
                    reject(error);
                });
        });
    }

    public decreaseUserStats(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
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

                this.updateUserStats(userStats)
                    .then(() => resolve(true))
                    .catch(e => reject(e));
            } catch (error) {
                reject({
                    error: error,
                    message: "Error in UserService.decreaseUserStats"
                });
            }
        });
    }

    public increaseUserStats(wineTasting: WineTasting) {
        return new Promise<boolean>((resolve, reject) => {
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

                this.updateUserStats(userStats)
                    .then(() => resolve(true))
                    .catch(e => reject(e));
            } catch (error) {
                reject({
                    error: error,
                    message: "Error in UserService.increaseUserStats"
                });
            }
        });
    }

    public needToUpdateApp() {
        return new Promise<boolean>((resolve, reject) => {
            firebase.getRemoteConfig(<any>{
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
                        resolve(localVersion !== res.properties["app_version"]);
                    });
            });
        });
    }

    private updateUserStats(userStats: UserStats) {
        return new Promise<boolean>((resolve, reject) => {
            let uid = this.getUser().uid;
            firebase.setValue("/user_stats/" + uid, userStats)
                .then(data => {
                    this.setUserStats(userStats);
                    resolve(true);
                })
                .catch(setValueError => {
                    reject({
                        error: setValueError,
                        message: "Error in UserService.updateUserStats"
                    });
                });
        });
    }

    private createUserProfile(email: string, uid: string) {
        return new Promise<boolean>((resolve, reject) => {
            let user = <User>{
                creationDate: Date.now(),
                email: email,
                lastConnectionDate: Date.now(),
                uid: uid
            };

            firebase.setValue("/users/" + user.uid, user)
                .then(data => {
                    this.setUser(user);
                    resolve(true);
                })
                .catch(error => {
                    console.log("ERROR firebase updateUserProfile : " + error);
                    reject(error);
                });
        });
    }

    private createUserStats(uid: string) {
        return new Promise<boolean>((resolve, reject) => {
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

            firebase.setValue("/user_stats/" + uid, userStats)
                .then(data => {
                    this.setUserStats(userStats);
                    resolve(true);
                })
                .catch(setValueError => {
                    console.log("ERROR firebase updateUserStats : " + setValueError);
                    reject(setValueError);
                });
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
                });
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
                });
        });
    }

    private pushCriteriaStat(criteriaStat: { [id: string]: string[] }, code: any, wineTastingId: string) {
        if (_.isEmpty(criteriaStat)) {
            criteriaStat = {};
        }
        if (_.isEmpty(criteriaStat[code])) {
            criteriaStat[code] = [];
        }
        criteriaStat[code].push(wineTastingId);

        return criteriaStat;
    }

    private popCriteriaStat(criteriaStat: { [id: string]: string[] }, code: any, wineTastingId: string) {
        if (_.isEmpty(criteriaStat)) {
            criteriaStat = {};
        }
        if (_.isEmpty(criteriaStat[code])) {
            criteriaStat[code] = [];
        }

        _.remove(criteriaStat[code], v => v === wineTastingId);

        return criteriaStat;
    }
}
