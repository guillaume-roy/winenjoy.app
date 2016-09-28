import {Observable} from "data/observable";
import {UserService} from "../services/userService";
import _ = require("lodash");

export class LoginViewModel extends Observable {
    private _email: string;
    private _password: string;
    private _isBusy: boolean;
    private _canSubmit: boolean;
    private _canForgotPassword: boolean;
    private _service: UserService;

    public get email() {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
        this.notifyPropertyChange("email", value);
        this.updateCanSubmit();
        this.updateCanForgotPassword();
    }

    public get password() {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
        this.notifyPropertyChange("password", value);
        this.updateCanSubmit();
    }

    public get canForgotPassword() {
        return this._canForgotPassword;
    }
    public set canForgotPassword(value: boolean) {
        this._canForgotPassword = value;
        this.notifyPropertyChange("canForgotPassword", value);
    }

    public get isBusy() {
        return this._isBusy;
    }
    public set isBusy(value: boolean) {
        this._isBusy = value;
        this.notifyPropertyChange("isBusy", value);
    }

    public get canSubmit() {
        return this._canSubmit;
    }
    public set canSubmit(value: boolean) {
        this._canSubmit = value;
        this.notifyPropertyChange("canSubmit", value);
    }

    constructor() {
        super();

        this.canForgotPassword = false;
        this.canSubmit = false;
        this.isBusy = false;

        this._service = new UserService();
    }

    public signup() {
        this.isBusy = true;
        return new Promise<boolean>((resolve, reject) => {
            let email = this.email.toLowerCase().trim();
            this._service.signup(email, this.password).then(signupRes => {
                this.isBusy = false;
                resolve(true);
            }).catch(signupError => {
                this.isBusy = false;
                reject(signupError);
            });
        });
    }

    public forgotPassword() {
        this.isBusy = true;
        return new Promise<boolean>((resolve, reject) => {
            let email = this.email.toLowerCase().trim();
            this._service.forgotPassword(email).then(res => {
                this.isBusy = false;
                resolve(true);
            }).catch(error => {
                this.isBusy = false;
                reject(error);
            });
        });
    }

    public login() {
        this.isBusy = true;
        let email = this.email.toLowerCase().trim();
        return this._service.login(email, this.password).then(loginRes => {
            this.isBusy = false;
            return;
        }).catch(error => {
            this.isBusy = false;
            throw error;
        });
    }

    private updateCanSubmit() {
        this.canSubmit = !_.isEmpty(this.email) && !_.isEmpty(this.password);
    }

    private updateCanForgotPassword() {
        this.canForgotPassword = !_.isEmpty(this.email);
    }
}
