import _ = require("lodash");
import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";
import {TastingsService} from "../services/tastingsService";

export class EditTastingViewModel extends Observable {
    private _wineDataService: WineDataService;
    private _tastingsService: TastingsService;
    private _wineTasting: WineTasting;
    private _isEditMode: boolean;
    private _wineTypes: CriteriaItem[];
    private _wineTypeSelectedIndex: number;
    private _limpidityCriterias: CriteriaItem[];
    private _shineCriterias: CriteriaItem[];
    private _tearCriterias: CriteriaItem[];
    private _bubbleCriterias: CriteriaItem[];
    private _intensityCriterias: CriteriaItem[];
    private _attackCriterias: CriteriaItem[];
    private _lengthCriterias: CriteriaItem[];
    private _tannicCriterias: CriteriaItem[];
    private _acidityCriterias: CriteriaItem[];
    private _alcoholValue: number;
    private _alcoholFormattedValue: number;
    private _hasBubbles: boolean;
    private _firstBindingTime: boolean;

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

    public get alcoholValue() {
        return this._alcoholValue;
    }

    public set alcoholValue(value: number) {
        this._alcoholValue = value;
        this.notifyPropertyChange("alcoholValue", value);
        this.alcoholFormattedValue = value / 10;
    }

    public get alcoholFormattedValue() {
        return this._alcoholFormattedValue;
    }

    public set alcoholFormattedValue(value: number) {
        this._alcoholFormattedValue = value;
        this.notifyPropertyChange("alcoholFormattedValue", value);
        this.wineTasting.alcohol = value;
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

    public get attackCriterias() {
        return this._attackCriterias;
    }

    public set attackCriterias(value) {
        this._attackCriterias = value;
        this.notifyPropertyChange("attackCriterias", value);
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
        this.onChangeWineType();
    }

     public get hasBubbles() {
        return this._hasBubbles;
    }
    public set hasBubbles(value) {
        this._hasBubbles = value;
        this.notifyPropertyChange("hasBubbles", value);
    }

     public get limpidityCriterias() {
        return this._limpidityCriterias;
    }

    public set limpidityCriterias(value) {
        this._limpidityCriterias = value;
        this.notifyPropertyChange("limpidityCriterias", value);
    }

    constructor(wineTasting: WineTasting) {
        super();

        this._tastingsService = new TastingsService();
        this._wineDataService = new WineDataService();

        this.isEditMode = !_.isEmpty(wineTasting.id);
        this.wineTasting = wineTasting;

        this._firstBindingTime = true;

        this.hasBubbles = this.wineTasting.bubbles.length > 0;

        if (_.isNumber(this.wineTasting.alcohol)) {
            this.alcoholValue = this.wineTasting.alcohol * 10;
        }

        this.limpidityCriterias = [];
        this.shineCriterias = [];
        this.tearCriterias = [];
        this.bubbleCriterias = [];
        this.intensityCriterias = [];
        this.lengthCriterias = [];
        this.tannicCriterias = [];
        this.acidityCriterias = [];
        this.attackCriterias = [];

        this._wineDataService = new WineDataService();
        this._wineDataService.getCriterias("limpidities")
            .then(data => this.limpidityCriterias = data);
        this._wineDataService.getCriterias("shines")
            .then(data => this.shineCriterias = data);
        this._wineDataService.getCriterias("tears")
            .then(data => this.tearCriterias = data);
        this._wineDataService.getCriterias("bubbles")
            .then(data => this.bubbleCriterias = data);
        this._wineDataService.getCriterias("intensities")
            .then(data => this.intensityCriterias = data);
        this._wineDataService.getCriterias("wineTypes")
            .then(data => {
                this._wineTypes = data;
                this.wineTypeSelectedIndex = this.isEditMode ? data.indexOf(_.find(data, this.wineTasting.wineType)) : 0;
                this._firstBindingTime = false;
            });
        this._wineDataService.getCriterias("length")
            .then(data => this.lengthCriterias = data);
        this._wineDataService.getCriterias("redTannics")
            .then(data => this.tannicCriterias = data);
        this._wineDataService.getCriterias("whiteAcidities")
            .then(data => this.acidityCriterias = data);
    }

    public saveTasting() {
        if (!this.hasBubbles) {
            this.wineTasting.bubbles = [];
        }

        return this._tastingsService.saveTasting(this.wineTasting);
    }

    public deleteTasting() {
        return this._tastingsService.deleteTasting(this.wineTasting);
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

    public setFinalRating(rating: number) {
        this.wineTasting.finalRating = rating;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
    }

    public setGrapes(grapes: CriteriaItem[]) {
        this.wineTasting.grapes = null;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
        this.wineTasting.grapes = grapes;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
    }

    public setAoc(aoc: CriteriaItem[]) {
        this.wineTasting.aoc = aoc;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
    }

    public setRegion(region: CriteriaItem) {
        this.wineTasting.region = region;
        this.setAoc(null);
    }

    public setCountry(country: CriteriaItem) {
        this.wineTasting.country = country;
        this.setRegion(null);
    }

    public setYear(year: number) {
        this.wineTasting.year = year;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
    }

    private onChangeWineType() {
        this.wineTasting.wineType = this._wineTypes[this.wineTypeSelectedIndex];

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

        if (!this._firstBindingTime) {
            this.wineTasting.color = null;
            this.wineTasting.balances = [];
            this.wineTasting.attacks = [];
        }
    }
}
