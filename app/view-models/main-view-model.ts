import {Observable} from "data/observable";
import {TastingsService} from "../services/tastingsService";
import {UserService} from "../services/userService";
import {WineTasting} from "../entities/wineTasting";
import {WineCriteriasService} from "../services/wineCriteriasService";

export class MainViewModel extends Observable {
    private _service: TastingsService;
    private _userService: UserService;
    private _wineCriteriasService: WineCriteriasService;

    constructor() {
        super();

        this._service = new TastingsService();
        this._userService = new UserService();
        this._wineCriteriasService = new WineCriteriasService();

        this.set("tastings", []);
    }

    init() {
        this.set("isBusy", true);
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getTastings(),
                this.loadCriterias()
            ]).then(() => {
                this.set("isBusy", false);
                resolve();
            }).catch(e => {
                this.set("isBusy", false);
                reject(e);
            });
        });
    }

    getTastings() {
        return new Promise((resolve, reject) => {
            this.set("tastings", []);
            this._service.getTastings()
                .then(data => {
                    this.set("tastings", data);
                    resolve();
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

    loadCriterias() {
        return Promise.all([
            this._wineCriteriasService.getLocations(),
            this.loadCriteria("acidities"),
            this.loadCriteria("attacks"),
            this.loadCriteria("developments"),
            this.loadCriteria("intensities"),
            this.loadCriteria("length"),
            this.loadCriteria("limpidities"),
            this.loadCriteria("shines"),
            this.loadCriteria("tannins"),
            this.loadCriteria("tears"),
            this.loadCriteria("wineTypes"),
            this.loadCriteria("years")]);
    }

    private loadCriteria(criteria) {
        return this._wineCriteriasService.getCriteriasFromFirebase(criteria);
    }
}
