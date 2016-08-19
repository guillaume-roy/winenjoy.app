import {Observable} from "data/observable";

export class InformationsStepViewModel extends Observable {
    private _years: any[];
    private _isBlindTasting: boolean;

    public get isBlindTasting() {
        return this._isBlindTasting;
    }
    public set isBlindTasting(value) {
        this._isBlindTasting = value;
        this.notifyPropertyChange("isBlindTasting", value);
    }

    public get years() {
        return this._years;
    }
    public set years(value) {
        this._years = value;
        this.notifyPropertyChange("years", value);
    }

    public init() {
        this.fillYears();
        this.isBlindTasting = false;
    }

    private fillYears() {
        var years = [];
        for (var i = new Date().getFullYear(); i >= 1900; i--) {
            years.push(i);
        }
        years.unshift("NA");
        this.years = years;
    }
}