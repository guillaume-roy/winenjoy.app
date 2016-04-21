import {Observable} from "data/observable";
import firebase = require("nativescript-plugin-firebase");
import {Config} from "../utils/config";
import {UserService} from "../services/userService";

export class LoginViewModel extends Observable {
    private _email: string;
    private _isBusy: boolean;

    public get email() {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
        this.notifyPropertyChange("email", value);
    }

    public get isBusy() {
        return this._isBusy;
    }
    public set isBusy(value: boolean) {
        this._isBusy = value;
        this.notifyPropertyChange("isBusy", value);
    }

    public login(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
           this.isBusy = true;

           if (!this.email || this.email.length < 1) {
               this.isBusy = false;
               resolve(false);
           }

            firebase.init({
                url: new Config().FirebaseUrl
            }).then(() => {
                firebase.query(result => {
                    this.isBusy = false;

                    if (!result) {
                        resolve(false);
                        return;
                    }

                    if (!result.value) {
                        resolve(false);
                        return;
                    }

                    if (result.value.length === 0) {
                        resolve(false);
                        return;
                    }

                    new UserService().setUser({
                        email: this.email.toLowerCase().trim()
                    });
                    resolve(true);
                },
                "beta_testers",
                {
                    orderBy: {
                        type: firebase.QueryOrderByType.CHILD,
                        value: "email"
                    },
                    range: {
                        type: firebase.QueryRangeType.EQUAL_TO,
                        value: this.email.toLowerCase().trim()
                    },
                    singleEvent: true
                }).catch(e => {
                    this.isBusy = false;
                    reject(e);
                });
            }, error => {
                this.isBusy = false;
                reject(error);
            });
        });
    }
}
