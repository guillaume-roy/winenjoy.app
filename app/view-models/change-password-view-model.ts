import {Observable} from "data/observable";
import {UserService} from "../services/userService";
import _ = require("lodash");

export class ChangePasswordViewModel extends Observable {
    private _email: string;
    private _oldPassword: string;
    private _newPassword: string;
    private _canSubmit: boolean;
    private _service: UserService;

    public get email() {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
        this.notifyPropertyChange("email", value);
        this.updateCanSubmit();
    }

    public get oldPassword() {
        return this._oldPassword;
    }
    public set oldPassword(value: string) {
        this._oldPassword = value;
        this.notifyPropertyChange("oldPassword", value);
        this.updateCanSubmit();
    }

    public get newPassword() {
        return this._newPassword;
    }
    public set newPassword(value: string) {
        this._newPassword = value;
        this.notifyPropertyChange("newPassword", value);
        this.updateCanSubmit();
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

        this._service = new UserService();
        this.email = this._service.getUser().email;
        this.canSubmit = false;
    }

    public changePassword() {
        return new Promise<boolean>((resolve, reject) => {
            let email = this.email.toLowerCase().trim();
            this._service.changePassword(email, this.oldPassword, this.newPassword).then(res => {
                this._service.logout().then(result => {
                    resolve(true);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    private updateCanSubmit() {
        this.canSubmit = !_.isEmpty(this.email)
            && !_.isEmpty(this.oldPassword)
            && !_.isEmpty(this.newPassword)
            && this.oldPassword !== this.newPassword;
    }
}