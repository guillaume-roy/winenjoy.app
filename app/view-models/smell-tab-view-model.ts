import _ = require("lodash");
import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";
import {TastingsService} from "../services/tastingsService";

export class SmellTabViewModel extends Observable {
    private _wineTasting: WineTasting;
    private _tastingsService: TastingsService;
    private _isEditMode: boolean;
    private _intensityCriterias: CriteriaItem[];
    private _wineDataService: WineDataService;

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

    public get intensityCriterias() {
        return this._intensityCriterias;
    }

    public set intensityCriterias(value) {
        this._intensityCriterias = value;
        this.notifyPropertyChange("intensityCriterias", value);
    }

    constructor() {
        super();

        this._tastingsService = new TastingsService();

        let wineTasting = this._tastingsService.loadTasting();
        this.isEditMode = !_.isEmpty(wineTasting.id);
        this.wineTasting = wineTasting;

        this._wineDataService = new WineDataService();

        this.intensityCriterias = [];
        this._wineDataService.getCriterias("intensities")
            .then(data => this.intensityCriterias = data);
    }

    public storeTasting() {
        this._tastingsService.storeTasting(this.wineTasting);
    }

    public saveTasting() {
        if (!this.isEditMode) {
            this.wineTasting.endDate = Date.now();
        } else {
            this.wineTasting.lastModificationDate = Date.now();

        }

        this._tastingsService.saveTasting(this.wineTasting);
    }

    public setAromas(aromas: CriteriaItem[]) {
        this.wineTasting.aromas = null;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
        this.wineTasting.aromas = aromas;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
    }

    public setDefects(defects: CriteriaItem[]) {
        this.wineTasting.defects = null;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
        this.wineTasting.defects = defects;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
    }
}
