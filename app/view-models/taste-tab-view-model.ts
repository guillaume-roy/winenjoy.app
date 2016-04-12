import {CriteriaItem} from "../entities/criteriaItem";
import {EditTastingViewModel} from "./edit-tasting-view-model";

export class TasteTabViewModel extends EditTastingViewModel {
    private _attackCriterias: CriteriaItem[];
    private _lengthCriterias: CriteriaItem[];
    private _tannicCriterias: CriteriaItem[];
    private _acidityCriterias: CriteriaItem[];

    public get lengthCriterias() {
        return this._lengthCriterias;
    }

    public set lengthCriterias(value) {
        this._lengthCriterias = value;
        this.notifyPropertyChange("lengthCriterias", value);
    }

    public get tannicCriterias() {
        return this._tannicCriterias;
    }

    public set tannicCriterias(value) {
        this._tannicCriterias = value;
        this.notifyPropertyChange("tannicCriterias", value);
    }

    public get acidityCriterias() {
        return this._acidityCriterias;
    }

    public set acidityCriterias(value) {
        this._acidityCriterias = value;
        this.notifyPropertyChange("acidityCriterias", value);
    }

    public get attackCriterias() {
        return this._attackCriterias;
    }

    public set attackCriterias(value) {
        this._attackCriterias = value;
        this.notifyPropertyChange("attackCriterias", value);
    }

    constructor() {
        super();

        this.lengthCriterias = [];
        this.tannicCriterias = [];
        this.acidityCriterias = [];
        this.attackCriterias = [];

        this._wineDataService.getCriterias("length")
            .then(data => this.lengthCriterias = data);
        this._wineDataService.getCriterias("redTannics")
            .then(data => this.tannicCriterias = data);
        this._wineDataService.getCriterias("whiteAcidities")
            .then(data => this.acidityCriterias = data);

        let criteriasName = "";
        switch (this.wineTasting.wineType.code) {
            case "WHITE":
                criteriasName = "whiteAttacks";
            break;
            case "ROSE":
                criteriasName = "roseAttacks";
            break;
            case "RED":
                criteriasName = "redAttacks";
            break;
        }

        this._wineDataService.getCriterias(criteriasName).then(data => {
            this.attackCriterias = data;
        });
    }
}
