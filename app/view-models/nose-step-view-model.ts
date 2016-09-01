import {Observable} from "data/observable";
import {WineDataService} from "../services/wineDataService";
import {CriteriaItem} from "../entities/criteriaItem";

export class NoseStepViewModel extends Observable {
    private _selectedAromas: CriteriaItem[];
    private _selectedAromaDefects: CriteriaItem[];

    public get selectedAromas() {
        return this._selectedAromas;
    }
    public set selectedAromas(value) {
        this._selectedAromas = value;
        this.notifyPropertyChange("selectedAromas", value);
    }

    public get selectedAromaDefects() {
        return this._selectedAromaDefects;
    }
    public set selectedAromaDefects(value) {
        this._selectedAromaDefects = value;
        this.notifyPropertyChange("selectedAromaDefects", value);
    }

    public init() {
        this.selectedAromas = [];
        this._selectedAromaDefects = [];
        var wineDataService = new WineDataService();
        wineDataService.getCriterias("intensities")
            .then(data => this.set("intensities", data));
        wineDataService.getCriterias("developments")
            .then(data => this.set("developments", data));
    }
}