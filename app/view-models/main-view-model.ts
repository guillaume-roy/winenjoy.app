import {Observable} from "data/observable";
import {Services} from "../utils/services";
import {IAppService} from "../services/IAppService";

export class MainViewModel extends Observable {
    private _service: IAppService;
    private _tastings: any[];
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

        this._service = Services.current;
        this.tastings = this._service.getWineTastings();
        this.betaIsClosed = new Date().getTime() > new Date(2016, 3, 17).getTime();
    }
}
