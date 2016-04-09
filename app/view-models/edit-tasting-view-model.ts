import _ = require("lodash");
import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";
import {TastingsService} from "../services/tastingsService";

export class EditTastingViewModel extends Observable {
    private _wineDataService: WineDataService;
    private _tabSelectedIndex: number;
    private _formIsValid: boolean;
    private _hasBubbles: boolean;
    private _wineTasting: WineTasting;
    private _wineTypeSelectedIndex: number;
    private _alcoholValue: number;
    private _alcoholFromattedValue: number;
    private _limpidityCriterias: CriteriaItem[];
    private _shineCriterias: CriteriaItem[];
    private _intensityCriterias: CriteriaItem[];
    private _tearCriterias: CriteriaItem[];
    private _bubbleCriterias: CriteriaItem[];
    private _lengthCriterias: CriteriaItem[];
    private _tannicCriterias: CriteriaItem[];
    private _acidityCriterias: CriteriaItem[];
    private _wineTypes: CriteriaItem[];
    private _attackCriterias: CriteriaItem[];
    private _wineYear: number;
    private _isEditMode: boolean;
    private _firstBindingTime: boolean;

    public get wineYear() {
        return this._wineYear;
    }

    public set wineYear(value) {
        this._wineYear = value;
        this.notifyPropertyChange("wineYear", value);

        this.wineTasting.year = value;
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

    public get limpidityCriterias() {
        return this._limpidityCriterias;
    }

    public set limpidityCriterias(value) {
        this._limpidityCriterias = value;
        this.notifyPropertyChange("limpidityCriterias", value);
    }

    public get tabSelectedIndex() {
        return this._tabSelectedIndex;
    }
    public set tabSelectedIndex(value) {
        this._tabSelectedIndex = value;
        this.notifyPropertyChange("tabSelectedIndex", value);
    }

    public get formIsValid() {
        return this._formIsValid;
    }
    public set formIsValid(value) {
        this._formIsValid = value;
        this.notifyPropertyChange("formIsValid", value);
    }

    public get hasBubbles() {
        return this._hasBubbles;
    }
    public set hasBubbles(value) {
        this._hasBubbles = value;
        this.notifyPropertyChange("hasBubbles", value);
    }

    public get wineTasting() {
        return this._wineTasting;
    }
    public set wineTasting(value) {
        this._wineTasting = value;
        this.notifyPropertyChange("wineTasting", value);
    }

    public get wineTypeSelectedIndex() {
        return this._wineTypeSelectedIndex;
    }
    public set wineTypeSelectedIndex(value: number) {
        this._wineTypeSelectedIndex = value;
        this.notifyPropertyChange("wineTypeSelectedIndex", value);

        if (!this._firstBindingTime) {
            this.wineTasting.wineType = this.wineTypes[value];
            this.wineTasting.color = null;
            this.wineTasting.balances = [];
            this.wineTasting.attacks = [];
        }

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

    public get alcoholValue() {
        return this._alcoholValue;
    }

    public set alcoholValue(value: number) {
        this._alcoholValue = value;
        this.notifyPropertyChange("alcoholValue", value);
        this.alcoholFromattedValue = value / 10;
    }

    public get alcoholFromattedValue() {
        return this._alcoholFromattedValue;
    }

    public set alcoholFromattedValue(value: number) {
        this._alcoholFromattedValue = value;
        this.notifyPropertyChange("alcoholFromattedValue", value);
        this.wineTasting.alcohol = value;
    }

    public get shineCriterias() {
        return this._shineCriterias;
    }

    public set shineCriterias(value) {
        this._shineCriterias = value;
        this.notifyPropertyChange("shineCriterias", value);
    }

    public get intensityCriterias() {
        return this._intensityCriterias;
    }

    public set intensityCriterias(value) {
        this._intensityCriterias = value;
        this.notifyPropertyChange("intensityCriterias", value);
    }

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

    public get wineTypes() {
        return this._wineTypes;
    }

    public set wineTypes(value) {
        this._wineTypes = value;
        this.notifyPropertyChange("wineTypes", value);
    }

    constructor(wineTasting: WineTasting) {
        super();

        this.isEditMode = !_.isEmpty(wineTasting);

        if (!this.isEditMode) {
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

            this.alcoholValue = 0;
        } else {
            this._firstBindingTime = true;
            this.wineTasting = wineTasting;
            this.alcoholValue = wineTasting.alcohol * 10;
            this.hasBubbles = this.wineTasting.bubbles.length > 0;
        }

        this.formIsValid = true;

        this.limpidityCriterias = [];
        this.shineCriterias = [];
        this.intensityCriterias = [];
        this.tearCriterias = [];
        this.bubbleCriterias = [];
        this.lengthCriterias = [];
        this.tannicCriterias = [];
        this.acidityCriterias = [];
        this.wineTypes = [];
        this.attackCriterias = [];

        this._wineDataService = new WineDataService();
        this._wineDataService.getCriterias("limpidities")
            .then(data => this.limpidityCriterias = data);
        this._wineDataService.getCriterias("shines")
            .then(data => this.shineCriterias = data);
        this._wineDataService.getCriterias("intensities")
            .then(data => this.intensityCriterias = data);
        this._wineDataService.getCriterias("tears")
            .then(data => this.tearCriterias = data);
        this._wineDataService.getCriterias("bubbles")
            .then(data => this.bubbleCriterias = data);
        this._wineDataService.getCriterias("length")
            .then(data => this.lengthCriterias = data);
        this._wineDataService.getCriterias("redTannics")
            .then(data => this.tannicCriterias = data);
        this._wineDataService.getCriterias("whiteAcidities")
            .then(data => this.acidityCriterias = data);
        this._wineDataService.getCriterias("wineTypes")
            .then(data => {
                this.wineTypes = data;
                this.wineTypeSelectedIndex = this.isEditMode ? data.indexOf(_.find(data, this.wineTasting.wineType)) : 0;
                this._firstBindingTime = false;
            });
    }

    public finishTasting() {
        if (!this.hasBubbles) {
            this.wineTasting.bubbles = [];
        }

        if (!this.isEditMode) {
            this.wineTasting.endDate = Date.now();
        } else {
            this.wineTasting.lastModificationDate = Date.now();

        }
        new TastingsService().saveTasting(this.wineTasting);
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

    public setGrapes(grapes: CriteriaItem[]) {
        this.wineTasting.grapes = null;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
        this.wineTasting.grapes = grapes;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
    }

    public setCountry(country: CriteriaItem) {
        this.wineTasting.country = country;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
    }

    public setYear(year: number) {
        this.wineTasting.year = year;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
    }

    public validateForm() {
        this.formIsValid = !_.isEmpty(this.wineTasting.cuvee)
            || !_.isEmpty(this.wineTasting.estate)
            || !_.isEmpty(this.wineTasting.region)
            || !_.isEmpty(this.wineTasting.country);
    }
}
