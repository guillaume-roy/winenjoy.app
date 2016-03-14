import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";
import {Services} from "../utils/services";
import {IAppService} from "../services/IAppService";
import geolocation = require("nativescript-geolocation");

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
    private _years: number[];
    private _alcoholValue: number;
    private _alcoholFromattedValue: number;
    private _hasBubbles: boolean;
    private _wineYear: number;

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

    public get years() {
        return this._years;
    }
    public set years(value) {
        this._years = value;
        this.notifyPropertyChange("years", value);
    }

    public get wineTypeSelectedIndex() {
        return this._wineTypeSelectedIndex;
    }
    public set wineTypeSelectedIndex(value: number) {
        this._wineTypeSelectedIndex = value;
        this.notifyPropertyChange("wineTypeSelectedIndex", value);

        this.wineTasting.wineType = this._wineTypes[value];
        this.wineTasting.color = null;

        this._service.getAttackCriteriasAsync(this.wineTasting.wineType.code)
            .then(data => {
                this.wineTasting.attacks = null;
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

    constructor() {
        super();

        this.wineTasting = {
            startDate: Date.now()
        };

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
                this.wineTypeSelectedIndex = 0;
            });

        this.alcoholValue = 0;
        this.wineYear = new Date().getFullYear() - 3;

        if (geolocation.isEnabled()) {
            geolocation.getCurrentLocation({timeout: 5000}).
            then(function(loc) {
                if (loc) {
                    this.wineTasting.latitude = loc.latitude;
                    this.wineTasting.longitude = loc.longitude;
                    this.wineTasting.altitude = loc.altitude;
                }
            });
        }
    }

    public finishTasting() {
        this.wineTasting.endDate = Date.now();
        console.dump(this.wineTasting);
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
