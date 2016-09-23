import {Observable} from "data/observable";
import {TastingsService} from "../services/tastingsService";
import {UserService} from "../services/userService";
import {WineTasting} from "../entities/wineTasting";

export class MainViewModel extends Observable {
    private _service: TastingsService;
    private _userService: UserService;

    constructor() {
        super();
        
        this._service = new TastingsService();
        this._userService = new UserService();
        this.set("tastings", []);
    }

    getTastings() {
        return new Promise((resolve, reject) => {
            this.set("isBusy", true);
            this.set("tastings", []);

            this._service.getTastings()
                .then(data => {
                    this.set("tastings", data);
                    this.set("isBusy", false);
                    resolve();
                })
                .catch(error => {
                    this.set("isBusy", false);
                    reject(error);
                });
        });
    }

    needToUpdateApp() {
        return this._userService.needToUpdateApp();
    }

    refreshTastings() {
        return new Promise((resolve, reject) => {
            this.set("isBusy", true);

            this._service.loadTastings()
                .then(() => this.getTastings())
                .catch(error => {
                    this.set("isBusy", false);
                    reject(error);
                });
        });
    }
}
