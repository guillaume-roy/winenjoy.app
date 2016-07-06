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

    public isLogged() {
        let user = this.getUser();
        return !_.isEmpty(user);
    }

    public init() {
        console.log("BEGIN firebase init");
        firebase.init({
            url: null
        }).then(() => {
            console.log("END firebase init");
        }, error => {
            console.log("ERROR firebase init : " + error);
        });
    }

    public login(email: string, password: string) {
        return new Promise<boolean>((resolve, reject) => {
            console.log("BEGIN firebase login");
            firebase.login({
                email: email,
                password: password,
                type: firebase.LoginType.PASSWORD
            }).then(res => {
                console.log("END firebase login");
                this.setUser({
                    email: email,
                    uid: res.uid
                });
                resolve(true);
            }).catch(error => {
                console.log("ERROR firebase login : " + error);
                reject(error);
            });
        });
    }

    public signup(email: string, password: string) {
        return new Promise<boolean>((resolve, reject) => {
            console.log("BEGIN firebase createUser");
            firebase.createUser({
                email: email,
                password: password
            }).then(res => {
                console.log("END firebase createUser");
                resolve(true);
            }).catch(createUserError => {
                console.log("ERROR firebase createUser : " + createUserError);
                reject(createUserError);
            });
        });
    }

    public forgotPassword(email: string) {
        return new Promise<boolean>((resolve, reject) => {
            console.log("BEGIN firebase resetPassword");
            firebase.resetPassword({
                email: email
            }).then(res => {
                console.log("END firebase resetPassword");
                resolve(true);
            }).catch(error => {
                console.log("ERROR firebase resetPassword : " + error);
                reject(error);
            });
        });
    }

    public changePassword(email: string, oldPassword: string, newPassword: string) {
        return new Promise<boolean>((resolve, reject) => {
            console.log("BEGIN firebase changePassword");
            firebase.changePassword({
                email: email,
                newPassword: newPassword,
                oldPassword: oldPassword
            }).then(res => {
                console.log("END firebase changePassword");
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
}
