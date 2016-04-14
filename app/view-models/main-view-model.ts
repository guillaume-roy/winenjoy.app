import {Observable} from "data/observable";
import {TastingsService} from "../services/tastingsService";
import {WineTasting} from "../entities/wineTasting";

export class MainViewModel extends Observable {
    private _service: TastingsService;
    private _tastings: WineTasting[];

    private _betaIsClosed: boolean;

    public get tastings() {
        return this._tastings;
    }
    public set tastings(value) {
        this._tastings = value;
        this.notifyPropertyChange("tastings", value);
    }

    public get betaIsClosed() {
        return this._betaIsClosed;
    }
    public set betaIsClosed(value) {
        this._betaIsClosed = value;
        this.notifyPropertyChange("betaIsClosed", value);
    }

    constructor() {
        super();

        this.betaIsClosed = new Date().getTime() > new Date(2016, 4, 15).getTime();

        this._service = new TastingsService();

        this.tastings = [];
        this._service.getTastings().then(data => {
            this.tastings = data;
        });
    }

    public new() {
        this._service.newTasting();
    }

    public edit(wineTastingId: string) {
        return this._service.editTasting(wineTastingId);
    }
}
