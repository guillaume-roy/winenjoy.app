import {Observable} from "data/observable";
import {WineCriteriasService} from "../services/wineCriteriasService";
import {CriteriaItem} from "../entities/criteriaItem";

export class RatingStepViewModel extends Observable {
    private _potentials: CriteriaItem[];
    private _finalRating: number;
    
    public get potentials() {
        return this._potentials;
    }
    public set potentials(values) {
        this._potentials = values;
        this.notifyPropertyChange("potentials", values);
    }

    public get finalRating() {
        return this._finalRating;
    }
    public set finalRating(value) {
        this._finalRating = value;
        this.notifyPropertyChange("finalRating", value);
    }

    public init() {
        this.finalRating = 2;

        var wineDataService = new WineCriteriasService();
        wineDataService.getCriterias("developments")
            .then(data => this.potentials = data);
    }
}