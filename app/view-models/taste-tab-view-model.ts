import _ = require("lodash");
import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";
import {TastingsService} from "../services/tastingsService";

export class TasteTabViewModel extends Observable {
    private _wineTasting: WineTasting;
    private _tastingsService: TastingsService;
    private _isEditMode: boolean;
    private _wineDataService: WineDataService;
    private _attackCriterias: CriteriaItem[];
    private _lengthCriterias: CriteriaItem[];
    private _tannicCriterias: CriteriaItem[];
    private _acidityCriterias: CriteriaItem[];

    public get lengthCriterias() {
        return this._lengthCriterias;
    }

    public set lengthCriterias(value) {
        this._lengthCriterias = value;
        this.notifyPropertyChange("lengthCriterias", value);
    }

    public get tannicCriterias() {
        return this._tannicCriterias;
    }

    public set tannicCriterias(value) {
        this._tannicCriterias = value;
        this.notifyPropertyChange("tannicCriterias", value);
    }

    public get acidityCriterias() {
        return this._acidityCriterias;
    }

    public set acidityCriterias(value) {
        this._acidityCriterias = value;
        this.notifyPropertyChange("acidityCriterias", value);
    }

    public get isEditMode() {
        return this._isEditMode;
    }

    public set isEditMode(value) {
        this._isEditMode = value;
        this.notifyPropertyChange("isEditMode", value);
    }

    public get attackCriterias() {
        return this._attackCriterias;
    }

    public set attackCriterias(value) {
        this._attackCriterias = value;
        this.notifyPropertyChange("attackCriterias", value);
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

        let wineTasting = this._tastingsService.loadTasting();
        this.isEditMode = !_.isEmpty(wineTasting.id);
        this.wineTasting = wineTasting;

        this._wineDataService = new WineDataService();

        this.lengthCriterias = [];
        this.tannicCriterias = [];
        this.acidityCriterias = [];
        this.attackCriterias = [];

        this._wineDataService.getCriterias("length")
            .then(data => this.lengthCriterias = data);
        this._wineDataService.getCriterias("redTannics")
            .then(data => this.tannicCriterias = data);
        this._wineDataService.getCriterias("whiteAcidities")
            .then(data => this.acidityCriterias = data);

        let criteriasName = "";
        switch (this.wineTasting.wineType.code) {
            case "WHITE":
                criteriasName = "whiteAttacks";
            break;
            case "ROSE":
                criteriasName = "roseAttacks";
            break;
            case "RED":
                criteriasName = "redAttacks";
            break;
        }

        this._wineDataService.getCriterias(criteriasName).then(data => {
            this.attackCriterias = data;
        });
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
}
