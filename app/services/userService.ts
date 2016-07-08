import {User} from "../entities/user";
import {UserStats} from "../entities/userStats";
import appSettings = require("application-settings");
import firebase = require("nativescript-plugin-firebase");
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
            firebase.init({
                onAuthStateChanged: (data: any) => {
                    if (data.loggedIn) {
                        resolve(true);
                    } else {
                        this.setUser(null);
                        resolve(false);
                    }
                }
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
                tastingsByAoc: [],
                tastingsByAromaDefects: [],
                tastingsByAromas: [],
                tastingsByBubbles: [],
                tastingsByCountry: [],
                tastingsByCuvee: [],
                tastingsByEstate: [],
                tastingsByFlavorDefects: [],
                tastingsByFlavors: [],
                tastingsByGrape: [],
                tastingsByIsBiodynamic: [],
                tastingsByIsBiological: [],
                tastingsByIsBlind: [],
                tastingsByRating: [],
                tastingsByRegion: [],
                tastingsByTastingYear: [],
                tastingsByWineType: [],
                tastingsByWineYear: [],
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
}
