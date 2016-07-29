import {WineTasting} from "../entities/wineTasting";
import {User} from "../entities/user";
import {UserStats} from "../entities/userStats";
import appSettings = require("application-settings");
import firebase = require("nativescript-plugin-firebase");
import {Config} from "../utils/config";
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
                Promise.all([ this.loadUserProfile(res.uid).then(() => this.updateLastConnectionDate()), this.loadUserStats(res.uid) ])
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
                Promise.all([ this.createUserProfile(email, res.uid), this.createUserStats(res.uid) ])
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
        let userStats = this.getUserStats();

        userStats.totalTastings -= 1;
        userStats.totalRatings -= wineTasting.finalRating;
        userStats.averageRating = userStats.totalRatings / userStats.totalTastings;

        userStats.tastingsByWineType = this.popCriteriaStat(userStats.tastingsByWineType, wineTasting.wineType.code, wineTasting.id);
        userStats.tastingsByRating = this.popCriteriaStat(userStats.tastingsByRating, wineTasting.finalRating, wineTasting.id);
        userStats.tastingsByEstate = this.popCriteriaStat(userStats.tastingsByEstate, wineTasting.estate, wineTasting.id);
        userStats.tastingsByRegion = this.popCriteriaStat(userStats.tastingsByRegion, wineTasting.region.code, wineTasting.id);
        userStats.tastingsByCuvee = this.popCriteriaStat(userStats.tastingsByCuvee, wineTasting.cuvee, wineTasting.id);
        userStats.tastingsByCountry = this.popCriteriaStat(userStats.tastingsByCountry, wineTasting.country.code, wineTasting.id);
        userStats.tastingsByAoc = this.popCriteriaStat(userStats.tastingsByAoc, wineTasting.aoc.code, wineTasting.id);
        userStats.tastingsByWineYear = this.popCriteriaStat(userStats.tastingsByWineYear, wineTasting.year, wineTasting.id);
        userStats.tastingsByIsBiological = this.popCriteriaStat(
            userStats.tastingsByIsBiological, wineTasting.isBiologic, wineTasting.id);
        userStats.tastingsByIsBiodynamic = this.popCriteriaStat(
            userStats.tastingsByIsBiodynamic, wineTasting.isBiodynamic, wineTasting.id);
        userStats.tastingsByIsBlind = this.popCriteriaStat(userStats.tastingsByIsBlind, wineTasting.isBlindTasting, wineTasting.id);
        userStats.tastingsByBubbles = this.popCriteriaStat(
            userStats.tastingsByBubbles, (!_.isEmpty(wineTasting.bubbles) && wineTasting.bubbles.length > 0), wineTasting.id);
        userStats.tastingsByTastingYear = this.popCriteriaStat(
            userStats.tastingsByTastingYear, new Date(wineTasting.startDate).getFullYear(), wineTasting.id);

        if (!_.isEmpty(wineTasting.grapes)) {
            for (let i = 0; i < wineTasting.grapes.length; i++) {
                userStats.tastingsByGrape = this.popCriteriaStat(
                    userStats.tastingsByGrape, wineTasting.grapes[i].code, wineTasting.id);
            }
        }

        if (!_.isEmpty(wineTasting.aromas)) {
            for (let i = 0; i < wineTasting.aromas.length; i++) {
                userStats.tastingsByAromas = this.popCriteriaStat(
                    userStats.tastingsByAromas, wineTasting.aromas[i].code, wineTasting.id);
            }
        }

        if (!_.isEmpty(wineTasting.defects)) {
            for (let i = 0; i < wineTasting.defects.length; i++) {
                userStats.tastingsByAromaDefects = this.popCriteriaStat(
                    userStats.tastingsByAromaDefects, wineTasting.defects[i].code, wineTasting.id);
            }
        }

        if (!_.isEmpty(wineTasting.flavors)) {
            for (let i = 0; i < wineTasting.flavors.length; i++) {
                userStats.tastingsByFlavors = this.popCriteriaStat(
                    userStats.tastingsByFlavors, wineTasting.flavors[i].code, wineTasting.id);
            }
        }

        if (!_.isEmpty(wineTasting.flavorDefects)) {
            for (let i = 0; i < wineTasting.flavorDefects.length; i++) {
                userStats.tastingsByFlavorDefects = this.popCriteriaStat(
                    userStats.tastingsByFlavorDefects, wineTasting.flavorDefects[i].code, wineTasting.id);
            }
        }

        this.updateUserStats(userStats);
    }

    public increaseUserStats(wineTasting: WineTasting) {
        let userStats = this.getUserStats();

        userStats.totalTastings += 1;
        userStats.totalRatings += wineTasting.finalRating;
        userStats.averageRating = userStats.totalRatings / userStats.totalTastings;

        userStats.tastingsByWineType = this.pushCriteriaStat(userStats.tastingsByWineType, wineTasting.wineType.code, wineTasting.id);
        userStats.tastingsByRating = this.pushCriteriaStat(userStats.tastingsByRating, wineTasting.finalRating, wineTasting.id);
        userStats.tastingsByEstate = this.pushCriteriaStat(userStats.tastingsByEstate, wineTasting.estate, wineTasting.id);
        userStats.tastingsByRegion = this.pushCriteriaStat(userStats.tastingsByRegion, wineTasting.region.code, wineTasting.id);
        userStats.tastingsByCuvee = this.pushCriteriaStat(userStats.tastingsByCuvee, wineTasting.cuvee, wineTasting.id);
        userStats.tastingsByCountry = this.pushCriteriaStat(userStats.tastingsByCountry, wineTasting.country.code, wineTasting.id);
        userStats.tastingsByAoc = this.pushCriteriaStat(userStats.tastingsByAoc, wineTasting.aoc.code, wineTasting.id);
        userStats.tastingsByWineYear = this.pushCriteriaStat(userStats.tastingsByWineYear, wineTasting.year, wineTasting.id);
        userStats.tastingsByIsBiological = this.pushCriteriaStat(userStats.tastingsByIsBiological, wineTasting.isBiologic, wineTasting.id);
        userStats.tastingsByIsBiodynamic = this.pushCriteriaStat(
            userStats.tastingsByIsBiodynamic, wineTasting.isBiodynamic, wineTasting.id);
        userStats.tastingsByIsBlind = this.pushCriteriaStat(userStats.tastingsByIsBlind, wineTasting.isBlindTasting, wineTasting.id);
        userStats.tastingsByBubbles = this.pushCriteriaStat(
            userStats.tastingsByBubbles, (!_.isEmpty(wineTasting.bubbles) && wineTasting.bubbles.length > 0), wineTasting.id);
        userStats.tastingsByTastingYear = this.pushCriteriaStat(
            userStats.tastingsByTastingYear, new Date(wineTasting.startDate).getFullYear(), wineTasting.id);

        if (!_.isEmpty(wineTasting.grapes)) {
            for (let i = 0; i < wineTasting.grapes.length; i++) {
                userStats.tastingsByGrape = this.pushCriteriaStat(
                    userStats.tastingsByGrape, wineTasting.grapes[i].code, wineTasting.id);
            }
        }

        if (!_.isEmpty(wineTasting.aromas)) {
            for (let i = 0; i < wineTasting.aromas.length; i++) {
                userStats.tastingsByAromas = this.pushCriteriaStat(
                    userStats.tastingsByAromas, wineTasting.aromas[i].code, wineTasting.id);
            }
        }

        if (!_.isEmpty(wineTasting.defects)) {
            for (let i = 0; i < wineTasting.defects.length; i++) {
                userStats.tastingsByAromaDefects = this.pushCriteriaStat(
                    userStats.tastingsByAromaDefects, wineTasting.defects[i].code, wineTasting.id);
            }
        }

        if (!_.isEmpty(wineTasting.flavors)) {
            for (let i = 0; i < wineTasting.flavors.length; i++) {
                userStats.tastingsByFlavors = this.pushCriteriaStat(
                    userStats.tastingsByFlavors, wineTasting.flavors[i].code, wineTasting.id);
            }
        }

        if (!_.isEmpty(wineTasting.flavorDefects)) {
            for (let i = 0; i < wineTasting.flavorDefects.length; i++) {
                userStats.tastingsByFlavorDefects = this.pushCriteriaStat(
                    userStats.tastingsByFlavorDefects, wineTasting.flavorDefects[i].code, wineTasting.id);
            }
        }

        this.updateUserStats(userStats);
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
                console.log("ERROR firebase updateUserStats : " + setValueError);
                reject(setValueError);
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
                tastingsByCuvee: {},
                tastingsByEstate: {},
                tastingsByFlavorDefects: {},
                tastingsByFlavors: {},
                tastingsByGrape: {},
                tastingsByIsBiodynamic: {},
                tastingsByIsBiological: {},
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
