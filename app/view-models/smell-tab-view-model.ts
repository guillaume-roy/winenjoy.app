import {CriteriaItem} from "../entities/criteriaItem";
import {EditTastingViewModel} from "./edit-tasting-view-model";

export class SmellTabViewModel extends EditTastingViewModel {
    private _intensityCriterias: CriteriaItem[];

    public get intensityCriterias() {
        return this._intensityCriterias;
    }

    public set intensityCriterias(value) {
        this._intensityCriterias = value;
        this.notifyPropertyChange("intensityCriterias", value);
    }

    constructor() {
        super();

        this.intensityCriterias = [];
        this._wineDataService.getCriterias("intensities")
            .then(data => this.intensityCriterias = data);
    }

    public setAromas(aromas: CriteriaItem[]) {
        this.wineTasting.aromas = null;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
        this.wineTasting.aromas = aromas;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
    }

    public setDefects(defects: CriteriaItem[]) {
        this.wineTasting.defects = null;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
        this.wineTasting.defects = defects;
        this.notifyPropertyChange("wineTasting", this.wineTasting);
    }
}
