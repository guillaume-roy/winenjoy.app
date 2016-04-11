import _ = require("lodash");
import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";
import {TastingsService} from "../services/tastingsService";

export class InformationsTabViewModel extends Observable {
    private _wineTasting: WineTasting;
    private _isEditMode: boolean;
    private _tastingsService: TastingsService;
    private _alcoholValue: number;
    private _alcoholFormattedValue: number;

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

        let wineTasting = this._tastingsService.loadTasting();
        this.isEditMode = !_.isEmpty(wineTasting.id);
        this.wineTasting = wineTasting;

        if (_.isNumber(wineTasting.alcohol)) {
            this.alcoholValue = wineTasting.alcohol * 10;
        }
    }

    public storeTasting() {
        this._tastingsService.storeTasting(this.wineTasting);
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

    public saveTasting() {
        if (!this.isEditMode) {
            this.wineTasting.endDate = Date.now();
        } else {
            this.wineTasting.lastModificationDate = Date.now();

        }

        this._tastingsService.saveTasting(this.wineTasting);
    }
}
