import {Observable} from "data/observable";
import {WineCriteriasService} from "../services/wineCriteriasService";
import {CriteriaItem} from "../entities/criteriaItem";
import _ = require("lodash");

export class TasteStepViewModel extends Observable {
    private _selectedFlavors: CriteriaItem[];
    private _selectedFlavorDefects: CriteriaItem[];

    public get selectedFlavors() {
        return this._selectedFlavors;
    }
    public set selectedFlavors(value) {
        this._selectedFlavors = value;
        this.notifyPropertyChange("selectedFlavors", value);
    }

    public get selectedFlavorDefects() {
        return this._selectedFlavorDefects;
    }
    public set selectedFlavorDefects(value) {
        this._selectedFlavorDefects = value;
        this.notifyPropertyChange("selectedFlavorDefects", value);
    }

    public init() {
        this._selectedFlavors = [];
        this._selectedFlavorDefects = [];
        var wineDataService = new WineCriteriasService();
        wineDataService.getCriterias("intensities")
            .then(data => this.set("intensities", data));
        wineDataService.getCriterias("attacks")
            .then(data => this.set("attacks", data));
        wineDataService.getCriterias("acidities")
            .then(data => this.set("acidities", data));
        wineDataService.getCriterias("tannins")
            .then(data => this.set("tannins", data));
        wineDataService.getCriterias("length")
            .then(data => this.set("length", data));
        //wineDataService.getCriterias("aromas")
        //    .then(data => {
        //        var nestedAromas = data.filter(d => d.code !== "DEFECTS")
        //            .map(a => {
        //                return a.values;
        //            });
        //        let aromas = _.sortBy(_.flattenDeep<CriteriaItem>(nestedAromas));
        //        this.set("flavors", aromas);
        //        this.set("flavorsLabels", aromas.map(a => a.label));

        //        var nestedAromaDefects = data.filter(d => d.code === "DEFECTS")
        //            .map(a => {
        //                return a.values;
        //            });
        //        let defects = _.sortBy(_.flattenDeep<CriteriaItem>(nestedAromaDefects));
        //        this.set("flavorDefects", defects);
        //        this.set("flavorDefectsLabels", defects.map(a => a.label));
        //    });
    }
}