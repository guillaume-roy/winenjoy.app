import _ = require("lodash");
import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";
import {WineDataService} from "../services/wineDataService";
import {TastingsService} from "../services/tastingsService";

export class EditTastingViewModel extends Observable {
    protected _wineDataService: WineDataService;
    protected _tastingsService: TastingsService;
    protected _wineTasting: WineTasting;
    protected _isEditMode: boolean;

    public get isEditMode() {
        return this._isEditMode;
    }

    public set isEditMode(value) {
        this._isEditMode = value;
        this.notifyPropertyChange("isEditMode", value);
    }

    public get wineTasting() {
        return this._wineTasting;
    }
    public set wineTasting(value) {
        this._wineTasting = value;
        this.notifyPropertyChange("wineTasting", value);
    }

    constructor() {
        super();

        this._tastingsService = new TastingsService();
        this._wineDataService = new WineDataService();

        let wineTasting = this._tastingsService.loadTasting();
        this.isEditMode = !_.isEmpty(wineTasting.id);
        this.wineTasting = wineTasting;
    }

    public storeTasting() {
        this._tastingsService.storeTasting(this.wineTasting);
    }

    public saveTasting() {
        return this._tastingsService.saveTasting(this.wineTasting);
    }

    public deleteTasting() {
        return this._tastingsService.deleteTasting(this.wineTasting);
    }
}
