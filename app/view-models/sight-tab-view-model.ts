import _ = require("lodash");
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";
import {EditTastingViewModel} from "./edit-tasting-view-model";

export class SightTabViewModel extends EditTastingViewModel {
    private _wineTypes: CriteriaItem[];
    private _wineTypeSelectedIndex: number;
    private _limpidityCriterias: CriteriaItem[];
    private _shineCriterias: CriteriaItem[];
    private _tearCriterias: CriteriaItem[];
    private _bubbleCriterias: CriteriaItem[];
    private _hasBubbles: boolean;
    private _firstBindingTime: boolean;

    public get tearCriterias() {
        return this._tearCriterias;
    }

    public set tearCriterias(value) {
        this._tearCriterias = value;
        this.notifyPropertyChange("tearCriterias", value);
    }

    public get bubbleCriterias() {
        return this._bubbleCriterias;
    }

    public set bubbleCriterias(value) {
        this._bubbleCriterias = value;
        this.notifyPropertyChange("bubbleCriterias", value);
    }

    public get shineCriterias() {
        return this._shineCriterias;
    }

    public set shineCriterias(value) {
        this._shineCriterias = value;
        this.notifyPropertyChange("shineCriterias", value);
    }

    public get wineTypeSelectedIndex() {
        return this._wineTypeSelectedIndex;
    }
    public set wineTypeSelectedIndex(value: number) {
        this._wineTypeSelectedIndex = value;
        this.notifyPropertyChange("wineTypeSelectedIndex", value);
        this.onChangeWineType();
    }

     public get hasBubbles() {
        return this._hasBubbles;
    }
    public set hasBubbles(value) {
        this._hasBubbles = value;
        this.notifyPropertyChange("hasBubbles", value);
    }

     public get limpidityCriterias() {
        return this._limpidityCriterias;
    }

    public set limpidityCriterias(value) {
        this._limpidityCriterias = value;
        this.notifyPropertyChange("limpidityCriterias", value);
    }

    constructor() {
        super();

        this._firstBindingTime = true;

        this.hasBubbles = this.wineTasting.bubbles.length > 0;

        this.limpidityCriterias = [];
        this.shineCriterias = [];
        this.tearCriterias = [];
        this.bubbleCriterias = [];

        this._wineDataService = new WineDataService();
        this._wineDataService.getCriterias("limpidities")
            .then(data => this.limpidityCriterias = data);
        this._wineDataService.getCriterias("shines")
            .then(data => this.shineCriterias = data);
        this._wineDataService.getCriterias("tears")
            .then(data => this.tearCriterias = data);
        this._wineDataService.getCriterias("bubbles")
            .then(data => this.bubbleCriterias = data);
        this._wineDataService.getCriterias("wineTypes")
            .then(data => {
                this._wineTypes = data;
                this.wineTypeSelectedIndex = this.isEditMode ? data.indexOf(_.find(data, this.wineTasting.wineType)) : 0;
                this._firstBindingTime = false;
            });
    }

    public storeTasting() {
        if (!this.hasBubbles) {
            this.wineTasting.bubbles = [];
        }
        super.storeTasting();
    }

    public saveTasting() {
         if (!this.hasBubbles) {
            this.wineTasting.bubbles = [];
        }
        super.saveTasting();
    }

    private onChangeWineType() {
        this.wineTasting.wineType = this._wineTypes[this.wineTypeSelectedIndex];

        if (!this._firstBindingTime) {
            this.wineTasting.color = null;
            this.wineTasting.balances = [];
            this.wineTasting.attacks = [];
        }
    }
}
