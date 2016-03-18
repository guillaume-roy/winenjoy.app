import {Observable} from "data/observable";
import {Services} from "../utils/services";
import firebase = require("nativescript-plugin-firebase");
import {Config} from "../utils/config";

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
            }).then(result => {
                firebase.query(value => {
                    this.isBusy = false;

                    if (value.value && value.value.length > 0) {
                        Services.current.setUserInformations({
                           email: this.email
                        });
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                "beta-testers",
                {
                    limit: {
                        type: firebase.QueryLimitType.FIRST,
                        value: 1
                    },
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
                    reject(e);
                    this.isBusy = false;
                });
            }, error => {
                this.isBusy = false;
                reject(error);
            });
        });
    }
}
