import _ = require("lodash");
import {CriteriaItem} from "../entities/criteriaItem";
import {EditTastingViewModel} from "./edit-tasting-view-model";

export class InformationsTabViewModel extends EditTastingViewModel {
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

    constructor() {
        super();

        if (_.isNumber(this.wineTasting.alcohol)) {
            this.alcoholValue = this.wineTasting.alcohol * 10;
        }
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
}
