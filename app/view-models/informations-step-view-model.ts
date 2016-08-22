import {Observable} from "data/observable";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";
import _ = require("lodash");

export class InformationsStepViewModel extends Observable {
    private _years: any[];
    private _isBlindTasting: boolean;
    private _selectedGrapes: CriteriaItem[];

    public get selectedGrapes() {
        return this._selectedGrapes;
    }

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
        this._selectedGrapes = [];

        var wineDataService = new WineDataService();
        wineDataService.getCriterias("grapes")
            .then(data => {
                let grapes = _.sortBy(data);
                this.set("grapes", grapes);
                this.set("grapesLabels", grapes.map(a => a.label));
            });
    }

    private fillYears() {
        var years = [];
        for (var i = new Date().getFullYear(); i >= 1900; i--) {
            years.push(i);
        }
        years.unshift("NA");
        this.years = years;
    }

    public addGrape(grapeLabel: string) {
        var grapes = this.get("grapes");
        var grape = _.find(grapes, (x: CriteriaItem) => x.label === grapeLabel);

        if (!_.some(this.selectedGrapes, (x: CriteriaItem) => x.id === grape.id)) {
            this.selectedGrapes.push(grape);
            this.notifyPropertyChange("selectedGrapes", []);
            this.notifyPropertyChange("selectedGrapes", this.selectedGrapes);
        }
    }
}