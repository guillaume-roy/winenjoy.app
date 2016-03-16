import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";
import {Services} from "../utils/services";
import {IAppService} from "../services/IAppService";
import _ = require("lodash");

export class TastingViewModel extends Observable {
    private _service: IAppService;
    private _limpidityCriterias: CriteriaItem[];
    private _shineCriterias: CriteriaItem[];
    private _intensityCriterias: CriteriaItem[];
    private _tearCriterias: CriteriaItem[];
    private _bubbleCriterias: CriteriaItem[];
    private _wineTypes: CriteriaItem[];
    private _lengthCriterias: CriteriaItem[];
    private _attackCriterias: CriteriaItem[];
    private _tannicCriterias: CriteriaItem[];
    private _acidityCriterias: CriteriaItem[];
    private _alcoholValue: number;
    private _alcoholFromattedValue: number;
    private _hasBubbles: boolean;
    private _wineYear: number;
    private _isEditMode: boolean;

    private _wineTasting: WineTasting;

    private _wineTypeSelectedIndex: number;

    public get wineYear() {
        return this._wineYear;
    }
    public set wineYear(value) {
        this._wineYear = value;
        this.notifyPropertyChange("wineYear", value);
        this.wineTasting.year = value;
    }

    public get isEditMode() {
        return this._isEditMode;
    }
    public set isEditMode(value) {
        this._isEditMode = value;
        this.notifyPropertyChange("isEditMode", value);
    }

    public get hasBubbles() {
        return this._hasBubbles;
    }
    public set hasBubbles(value) {
        this._hasBubbles = value;
        this.notifyPropertyChange("hasBubbles", value);
    }

    public get wineTasting() {
        return this._wineTasting;
    }
    public set wineTasting(value) {
        this._wineTasting = value;
        this.notifyPropertyChange("wineTasting", value);
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

    public get limpidityCriterias() {
        return this._limpidityCriterias;
    }
    public set limpidityCriterias(value) {
        this._limpidityCriterias = value;
        this.notifyPropertyChange("limpidityCriterias", value);
    }

    public get lengthCriterias() {
        return this._lengthCriterias;
    }
    public set lengthCriterias(value) {
        this._lengthCriterias = value;
        this.notifyPropertyChange("lengthCriterias", value);
    }

    public get intensityCriterias() {
        return this._intensityCriterias;
    }
    public set intensityCriterias(value) {
        this._intensityCriterias = value;
        this.notifyPropertyChange("intensityCriterias", value);
    }

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

    public get wineTypes() {
        return this._wineTypes;
    }
    public set wineTypes(value) {
        this._wineTypes = value;
        this.notifyPropertyChange("wineTypes", value);
    }

    public get wineTypeSelectedIndex() {
        return this._wineTypeSelectedIndex;
    }
    public set wineTypeSelectedIndex(value: number) {
        this._wineTypeSelectedIndex = value;
        this.notifyPropertyChange("wineTypeSelectedIndex", value);

        this.wineTasting.wineType = this._wineTypes[value];
        this.wineTasting.color = null;
        this.wineTasting.balances = [];

        this._service.getAttackCriteriasAsync(this.wineTasting.wineType.code)
            .then(data => {
                this.wineTasting.attacks = [];
                this.attackCriterias = data;
            });
    }

    public get alcoholValue() {
        return this._alcoholValue;
    }
    public set alcoholValue(value: number) {
        this._alcoholValue = value;
        this.notifyPropertyChange("alcoholValue", value);

        this.alcoholFromattedValue = value / 10;
    }

    public get alcoholFromattedValue() {
        return this._alcoholFromattedValue;
    }
    public set alcoholFromattedValue(value: number) {
        this._alcoholFromattedValue = value;
        this.notifyPropertyChange("alcoholFromattedValue", value);

        this.wineTasting.alcohol = value;
    }

    constructor(wineTasting: WineTasting) {
        super();

        if (wineTasting) {
            this.isEditMode = true;
            this.wineTasting = wineTasting;
            this.wineYear = this.wineTasting.year;
            this.alcoholValue = this.wineTasting.alcohol;
        } else {
            this.wineTasting = {
                attacks: [],
                balances: [],
                bubbles: [],
                intensities: [],
                length: [],
                limpidities: [],
                shines: [],
                startDate: Date.now(),
                tears: []
            };

            this.wineYear = new Date().getFullYear() - 3;
            this.alcoholValue = 0;
        }

        this._service = Services.current;

        this._service.getLimpidityCriteriasAsync()
            .then(data => this.limpidityCriterias = data);
        this._service.getShineCriteriasAsync()
            .then(data => this.shineCriterias = data);
        this._service.getIntensityCriteriasAsync()
            .then(data => this.intensityCriterias = data);
        this._service.getTearCriteriasAsync()
            .then(data => this.tearCriterias = data);
        this._service.getBubbleCriteriasAsync()
            .then(data => this.bubbleCriterias = data);
        this._service.getLengthCriteriasAsync()
            .then(data => this.lengthCriterias = data);
        this._service.getTannicCriteriasAsync()
            .then(data => this.tannicCriterias = data);
        this._service.getWhiteAcidityCriteriasAsync()
            .then(data => this.acidityCriterias = data);
        this._service.getWineTypesAsync()
            .then(data => {
                this.wineTypes = data;

                if (!wineTasting) {
                    this.wineTypeSelectedIndex = 0;
                } else {
                    this.wineTypeSelectedIndex = _.indexOf(data, _.find(data, this.wineTasting.wineType));
                }
            });
    }

    public finishTasting() {
        this.wineTasting.endDate = Date.now();
        this._service.saveWineTasting(this.wineTasting);
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

    public getShareMessage() {
        let wineColor = this.wineTasting.wineType.label;
        let year = this.wineTasting.year;

        let cuvee = this.wineTasting.cuvee;
        let estate = this.wineTasting.estate;

        let result = "#Dégustation d'un #vin #" + wineColor;

        if (cuvee) {
            result = result + " " + cuvee;
        }

        if (estate) {
            result = result + " " + estate;
        }

        if (year) {
            result = result + " #" + year;
        }

        result = result + " via @WinenjoyApp";

        return result;
    }

    public deleteTasting() {
        this._service.deleteWineTasting(this.wineTasting);
    }
}
