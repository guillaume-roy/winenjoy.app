import _ = require("lodash");
import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";
import {TastingsService} from "../services/tastingsService";

export class SightTabViewModel extends Observable {
    private _wineDataService: WineDataService;
    private _wineTypes: CriteriaItem[];
    private _wineTypeSelectedIndex: number;
    private _wineTasting: WineTasting;
    private _limpidityCriterias: CriteriaItem[];
    private _shineCriterias: CriteriaItem[];
    private _tearCriterias: CriteriaItem[];
    private _bubbleCriterias: CriteriaItem[];
    private _hasBubbles: boolean;
    private _isEditMode: boolean;
    private _firstBindingTime: boolean;

    public get tearCriterias() {
        return this._tearCriterias;
    }

    public set tearCriterias(value) {
        this._tearCriterias = value;
        this.notifyPropertyChange("tearCriterias", value);
    }

    public get bubbleCriterias() {
        return this._bubbleCriterias;
    }

    public set bubbleCriterias(value) {
        this._bubbleCriterias = value;
        this.notifyPropertyChange("bubbleCriterias", value);
    }

    public get shineCriterias() {
        return this._shineCriterias;
    }

    public set shineCriterias(value) {
        this._shineCriterias = value;
        this.notifyPropertyChange("shineCriterias", value);
    }

    public get wineTypeSelectedIndex() {
        return this._wineTypeSelectedIndex;
    }
    public set wineTypeSelectedIndex(value: number) {
        this._wineTypeSelectedIndex = value;
        this.notifyPropertyChange("wineTypeSelectedIndex", value);

        if (!this._firstBindingTime) {
            // this.wineTasting.wineType = this.wineTypes[value];
            this.wineTasting.color = null;
            this.wineTasting.balances = [];
            this.wineTasting.attacks = [];
        }
    }

     public get hasBubbles() {
        return this._hasBubbles;
    }
    public set hasBubbles(value) {
        this._hasBubbles = value;
        this.notifyPropertyChange("hasBubbles", value);
    }

    public get isEditMode() {
        return this._isEditMode;
    }

    public set isEditMode(value) {
        this._isEditMode = value;
        this.notifyPropertyChange("isEditMode", value);
    }

     public get limpidityCriterias() {
        return this._limpidityCriterias;
    }

    public set limpidityCriterias(value) {
        this._limpidityCriterias = value;
        this.notifyPropertyChange("limpidityCriterias", value);
    }

    public get wineTasting() {
        return this._wineTasting;
    }
    public set wineTasting(value) {
        this._wineTasting = value;
        this.notifyPropertyChange("wineTasting", value);
    }

    constructor(wineTasting: WineTasting) {
        super();

        this.isEditMode = !_.isEmpty(wineTasting);

        this.wineTasting = {
            aromas: [],
            attacks: [],
            balances: [],
            bubbles: [],
            country: null,
            defects: [],
            finalRating: "NEUTRAL",
            intensities: [],
            length: [],
            limpidities: [],
            shines: [],
            startDate: Date.now(),
            tears: []
        };

        this.limpidityCriterias = [];
        this.shineCriterias = [];
        this.tearCriterias = [];
        this.bubbleCriterias = [];

        this._wineDataService = new WineDataService();
        this._wineDataService.getCriterias("limpidities")
            .then(data => this.limpidityCriterias = data);
        this._wineDataService.getCriterias("shines")
            .then(data => this.shineCriterias = data);
        this._wineDataService.getCriterias("tears")
            .then(data => this.tearCriterias = data);
        this._wineDataService.getCriterias("bubbles")
            .then(data => this.bubbleCriterias = data);
    }
}