import {Observable} from "data/observable";
import {WineDataService} from "../services/wineDataService";
import {CriteriaItem} from "../entities/criteriaItem";

export class TasteStepViewModel extends Observable {
    private _intensities: CriteriaItem[];
    private _attacks: CriteriaItem[];
    private _acidities: CriteriaItem[];
    private _tannins: CriteriaItem[];
    private _length: CriteriaItem[];

    public get length() {
        return this._length;
    }
    public set length(values) {
        this._length = values;
        this.notifyPropertyChange("length", values);
    }

    public get tannins() {
        return this._tannins;
    }
    public set tannins(values) {
        this._tannins = values;
        this.notifyPropertyChange("tannins", values);
    }
    
    public get intensities() {
        return this._intensities;
    }
    public set intensities(values) {
        this._intensities = values;
        this.notifyPropertyChange("intensities", values);
    }

    public get acidities() {
        return this._acidities;
    }
    public set acidities(values) {
        this._acidities = values;
        this.notifyPropertyChange("acidities", values);
    }

    public get attacks() {
        return this._attacks;
    }
    public set attacks(values) {
        this._attacks = values;
        this.notifyPropertyChange("attacks", values);
    }

    public init() {
        var wineDataService = new WineDataService();
        wineDataService.getCriterias("intensities")
            .then(data => this.intensities = data);
        wineDataService.getCriterias("attacks")
            .then(data => this.attacks = data);
        wineDataService.getCriterias("acidities")
            .then(data => this.acidities = data);
        wineDataService.getCriterias("tannins")
            .then(data => this.tannins = data);
        wineDataService.getCriterias("length")
            .then(data => this.length = data);
    }
}