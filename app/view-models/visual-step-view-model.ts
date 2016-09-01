import {Observable} from "data/observable";
import {WineCriteriasService} from "../services/wineCriteriasService";
import {CriteriaItem} from "../entities/criteriaItem";

export class VisualStepViewModel extends Observable {
    private _limpidities: CriteriaItem[];
    private _shines: CriteriaItem[];
    private _tears: CriteriaItem[];

    public get limpidities() {
        return this._limpidities;
    }
    public set limpidities(values) {
        this._limpidities = values;
        this.notifyPropertyChange("limpidities", values);
    }

    public get shines() {
        return this._shines;
    }
    public set shines(values) {
        this._shines = values;
        this.notifyPropertyChange("shines", values);
    }

    public get tears() {
        return this._tears;
    }
    public set tears(values) {
        this._tears = values;
        this.notifyPropertyChange("tears", values);
    }

    public init() {
        var wineDataService = new WineCriteriasService();
        wineDataService.getCriterias("limpidities")
            .then(data => this.limpidities = data);
        wineDataService.getCriterias("shines")
            .then(data => this.shines = data);
        wineDataService.getCriterias("tears")
            .then(data => this.tears = data);
    }
}