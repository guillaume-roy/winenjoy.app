import {Observable} from "data/observable";
import {Services} from "../utils/services";
import {IAppService} from "../services/IAppService";

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

    public login() {
        this.isBusy = true;
    }
}
