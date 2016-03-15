import {Observable} from "data/observable";
import {Services} from "../utils/services";
import {IAppService} from "../services/IAppService";

export class MainViewModel extends Observable {
    private _service: IAppService;
    private _tastings: any[];

    public get tastings() {
        return this._tastings;
    }
    public set tastings(value) {
        this._tastings = value;
        this.notifyPropertyChange("tastings", value);
    }

    constructor() {
        super();

        this._service = Services.current;
        this.tastings = this._service.getWineTastings();
    }
}
