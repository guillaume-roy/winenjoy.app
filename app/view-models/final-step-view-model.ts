import {Observable} from "data/observable";
import {WineDataService} from "../services/wineDataService";
import {CriteriaItem} from "../entities/criteriaItem";

export class FinalStepViewModel extends Observable {
    private _potentials: CriteriaItem[];
    
    public get potentials() {
        return this._potentials;
    }
    public set potentials(values) {
        this._potentials = values;
        this.notifyPropertyChange("potentials", values);
    }

    public init() {
        var wineDataService = new WineDataService();
        wineDataService.getCriterias("potentials")
            .then(data => this.potentials = data);
    }
}