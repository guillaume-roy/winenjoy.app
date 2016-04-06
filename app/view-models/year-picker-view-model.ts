import {Observable} from "data/observable";
import _ = require("lodash");

export class YearPickerViewModel extends Observable {
    private _years: number[];
    private _selectedYear: number;
    private _selectedYearIndex: number;

    public get years() {
        return this._years;
    }

    public get selectedYear() {
        return this._selectedYear;
    }

    public set selectedYear(value) {
        this._selectedYear = value;
        this.notifyPropertyChange("selectedYear", value);
    }

    public get selectedYearIndex() {
        return this._selectedYearIndex;
    }

    public set selectedYearIndex(value) {
        this._selectedYearIndex = value;
        this.notifyPropertyChange("selectedYearIndex", value);

        this.selectedYear = this.years[value];
    }

    constructor(selectedYear: number) {
        super();

        this._years = [];

        let currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= 1900 + 1; i--) {
            this._years.push(i);
        }

        if (!_.isEmpty(selectedYear)) {
            this.selectedYearIndex = this.years.indexOf(selectedYear);
        } else {
            this.selectedYearIndex = 0;
        }
    }
}
