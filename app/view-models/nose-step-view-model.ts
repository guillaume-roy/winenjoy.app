import {Observable} from "data/observable";
import {ObservableArray} from "data/observable-array";
import {WineDataService} from "../services/wineDataService";
import {CriteriaItem} from "../entities/criteriaItem";
import _ = require("lodash");

export class NoseStepViewModel extends Observable {
    private _selectedAromas: CriteriaItem[];
    private _selectedAromaDefects: CriteriaItem[];

    public get selectedAromas() {
        return this._selectedAromas;
    }
    public get selectedAromaDefects() {
        return this._selectedAromaDefects;
    }

    public init() {
        this._selectedAromas = [];
        this._selectedAromaDefects = [];
        var wineDataService = new WineDataService();
        wineDataService.getCriterias("intensities")
            .then(data => this.set("intensities", data));
        wineDataService.getCriterias("nose-developments")
            .then(data => this.set("developments", data));
        wineDataService.getCriterias("nose-developments")
            .then(data => this.set("developments", data));
        wineDataService.getCriterias("aromas")
            .then(data => {
                var nestedAromas = data.filter(d => d.code !== "DEFECTS")
                    .map(a => {
                        return a.values;
                    });
                let aromas = _.sortBy(_.flattenDeep<CriteriaItem>(nestedAromas));
                this.set("aromas", aromas);
                this.set("aromasLabels", aromas.map(a => a.label));

                var nestedAromaDefects = data.filter(d => d.code === "DEFECTS")
                    .map(a => {
                        return a.values;
                    });
                let defects = _.sortBy(_.flattenDeep<CriteriaItem>(nestedAromaDefects));
                this.set("aromaDefects", defects);
                this.set("aromaDefectsLabels", defects.map(a => a.label));
            });
    }

    public addAroma(aromaLabel: string) {
        var aromas = this.get("aromas");
        var aroma = _.find(aromas, (x: CriteriaItem) => x.label === aromaLabel);

        if (!_.some(this.selectedAromas, (x: CriteriaItem) => x.id === aroma.id)) {
            this.selectedAromas.push(aroma);
            this.notifyPropertyChange("selectedAromas", []);
            this.notifyPropertyChange("selectedAromas", this.selectedAromas);
        }
    }

    public addAromaDefect(aromaLabel: string) {
        var defects = this.get("aromaDefects");
        var defect = _.find(defects, (x: CriteriaItem) => x.label === aromaLabel);

        if (!_.some(this.selectedAromaDefects, (x: CriteriaItem) => x.id === defect.id)) {
            this.selectedAromaDefects.push(defect);
            this.notifyPropertyChange("selectedAromaDefects", []);
            this.notifyPropertyChange("selectedAromaDefects", this.selectedAromaDefects);
        }
    }
}