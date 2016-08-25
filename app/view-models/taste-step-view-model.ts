import {Observable} from "data/observable";
import {WineDataService} from "../services/wineDataService";
import {CriteriaItem} from "../entities/criteriaItem";
import _ = require("lodash");

export class TasteStepViewModel extends Observable {
    private _selectedFlavors: CriteriaItem[];
    private _selectedFlavorDefects: CriteriaItem[];

    public get selectedFlavors() {
        return this._selectedFlavors;
    }
    public get selectedFlavorDefects() {
        return this._selectedFlavorDefects;
    }

    public init() {
        this._selectedFlavors = [];
        this._selectedFlavorDefects = [];
        var wineDataService = new WineDataService();
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
        wineDataService.getCriterias("aromas")
            .then(data => {
                var nestedAromas = data.filter(d => d.code !== "DEFECTS")
                    .map(a => {
                        return a.values;
                    });
                let aromas = _.sortBy(_.flattenDeep<CriteriaItem>(nestedAromas));
                this.set("flavors", aromas);
                this.set("flavorsLabels", aromas.map(a => a.label));

                var nestedAromaDefects = data.filter(d => d.code === "DEFECTS")
                    .map(a => {
                        return a.values;
                    });
                let defects = _.sortBy(_.flattenDeep<CriteriaItem>(nestedAromaDefects));
                this.set("flavorDefects", defects);
                this.set("flavorDefectsLabels", defects.map(a => a.label));
            });
    }

    public addFlavor(flavorLabel: string) {
        var flavors = this.get("flavors");
        var flavor = _.find(flavors, (x: CriteriaItem) => x.label === flavorLabel);

        if (!_.some(this.selectedFlavors, (x: CriteriaItem) => x.id === flavor.id)) {
            this.selectedFlavors.push(flavor);
            this.notifyPropertyChange("selectedFlavors", []);
            this.notifyPropertyChange("selectedFlavors", this.selectedFlavors);
        }
    }

    public addFlavorDefect(flavorLabel: string) {
        var defects = this.get("flavorDefects");
        var defect = _.find(defects, (x: CriteriaItem) => x.label === flavorLabel);

        if (!_.some(this.selectedFlavorDefects, (x: CriteriaItem) => x.id === defect.id)) {
            this.selectedFlavorDefects.push(defect);
            this.notifyPropertyChange("selectedFlavorDefects", []);
            this.notifyPropertyChange("selectedFlavorDefects", this.selectedFlavorDefects);
        }
    }
}