import {User} from "../entities/user";
import appSettings = require("application-settings");
import firebase = require("nativescript-plugin-firebase");
import {Config} from "../utils/config";

export class UserService {
    private static USER_KEY = "USER";
    private _config: Config;

    constructor() {
        this._config = new Config();
    }

    public getUser() {
        return <User>JSON.parse(appSettings.getString(UserService.USER_KEY, null));
    }

    public setUser(value: User) {
        appSettings.setString(UserService.USER_KEY, JSON.stringify(value));
    }

    public isLogged() {
        let user = this.getUser();

        if (!user) {
            return false;
        }

        let date = new Date();
        let seconds = date.getTime() / 1000;

        return user.firebaseExpiration > seconds;
    }

    public login(email: string, password: string) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.init({
                url: this._config.FirebaseUrl
            }).then(() => {
                firebase.login({
                    email: email,
                    password: password,
                    type: firebase.LoginType.PASSWORD
                }).then(res => {
                    this.setUser({
                        email: email,
                        firebaseExpiration: res.expiresAtUnixEpochSeconds,
                        firebaseToken: res.token,
                        firebaseUid: res.uid
                    });
                    resolve(true);
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    public signup(email: string, password: string) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.init({
                url: this._config.FirebaseUrl
            }).then(() => {
                firebase.createUser({
                    email: email,
                    password: password
                }).then(res => {
                    resolve(true);
                }).catch(error => {
                    reject(error);
                    // switch (error.code) {
                    //     case "EMAIL_TAKEN":
                    //         reject("Cet email est déjà utilisé.");
                    //         break;
                    //     case "INVALID_EMAIL":
                    //         reject("Cet email est invalide.");
                    //         break;
                    //     default:
                    //         reject("Erreur lors de la création de votre compte.");
                    //         break;
                    // }
                });
            });
        });
    }

    public forgotPassword(email: string) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.init({
                url: this._config.FirebaseUrl
            }).then(() => {
                firebase.resetPassword({
                    email: email
                }).then(res => {
                    resolve(true);
                }).catch(error => {
                    reject(error);
                //    switch (error.code) {
                //         case "INVALID_USER":
                //             reject("Cet utilisateur n'existe pas.");
                //             break;
                //         default:
                //             reject("Erreur lors de la réinitialisation de votre mot de passe.");
                //             break;
                //     }
                });
            });
        });
    }

    public changePassword(email: string, oldPassword: string, newPassword: string) {
        return new Promise<boolean>((resolve, reject) => {
            firebase.init({
                url: this._config.FirebaseUrl
            }).then(() => {
                // Waiting the plugin
                resolve(true);
            });
        });
    }
}
