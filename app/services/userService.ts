import {User} from "../entities/user";
import appSettings = require("application-settings");
import firebase = require("nativescript-plugin-firebase");
import _ = require("lodash");

export class UserService {
    private static USER_KEY = "USER";

    public getUser() {
        return <User>JSON.parse(appSettings.getString(UserService.USER_KEY, null));
    }

    public setUser(value: User) {
        appSettings.setString(UserService.USER_KEY, JSON.stringify(value));
    }

    public init() {
        return new Promise<boolean>((resolve, reject) => {
            firebase.init({
                onAuthStateChanged: (data: any) => {
                    if (data.loggedIn) {
                        this.updateUserProfile(data)
                        .then(() => {
                            resolve(true);
                        });
                    } else {
                        this.setUser(null);
                        resolve(false);
                    }
                },
                url: null
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
                resolve(true);
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
            }).then(res => {
                resolve(true);
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
            resolve(true);
        });
    }

    private updateUserProfile(fbUser) {
        return new Promise<boolean>((resolve, reject) => {
            let user = this.getUser();
            if (_.isEmpty(user)) {
                user = <User>{
                    creationDate: Date.now(),
                    email: fbUser.user.email,
                    lastConnectionDate: Date.now(),
                    uid: fbUser.user.uid
                };
            } else {
                user.lastConnectionDate = Date.now();
            }

            firebase.setValue("/users/" + user.uid, user)
            .then(data => {
                this.setUser(user);
                resolve(true);
            })
            .catch(setValueError => {
                console.log("ERROR firebase updateUserProfile : " + setValueError);
                reject(setValueError);
            });
        });
    }
}
