import {Observable} from "data/observable";
import {WineDataService} from "../services/wineDataService";
import {CriteriaItem} from "../entities/criteriaItem";

export class NoseStepViewModel extends Observable {
    private _intensities: CriteriaItem[];
    private _developments: CriteriaItem[];
    
    public get intensities() {
        return this._intensities;
    }
    public set intensities(values) {
        this._intensities = values;
        this.notifyPropertyChange("intensities", values);
    }

    public get developments() {
        return this._developments;
    }
    public set developments(values) {
        this._developments = values;
        this.notifyPropertyChange("developments", values);
    }

    public init() {
        var wineDataService = new WineDataService();
        wineDataService.getCriterias("intensities")
            .then(data => this.intensities = data);
        wineDataService.getCriterias("nose-developments")
            .then(data => this.developments = data);
    }
}