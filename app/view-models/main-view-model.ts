import {Observable} from "data/observable";
import {TastingsService} from "../services/tastingsService";
import {WineTasting} from "../entities/wineTasting";

export class MainViewModel extends Observable {
    private _service: TastingsService;
    private _tastings: WineTasting[];

    public get tastings() {
        return this._tastings;
    }
    public set tastings(value) {
        this._tastings = value;
        this.notifyPropertyChange("tastings", value);
    }
    constructor() {
        super();

        this._service = new TastingsService();

        this.tastings = [];
        this._service.getTastings().then(data => {
            this.tastings = data;
        });
    }

    public newTasting() {
        return this._service.newTasting();
    }
}
