import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";
import {Services} from "../utils/services";
import {IAppService} from "../services/IAppService";

export class TastingViewModel extends Observable {
    private _service: IAppService;
    private _limpidityCriterias: CriteriaItem[];
    private _sightIntensityCriterias: CriteriaItem[];
    private _smellIntensityCriterias: CriteriaItem[];
    private _tearCriterias: CriteriaItem[];
    private _bubbleCriterias: CriteriaItem[];
    private _wineTypes: CriteriaItem[];
    private _years: number[];
    private _alcoholValue: number;
    private _alcoholFromattedValue: number;
    private _hasTears: boolean;
    private _hasBubbles: boolean;

    private _wineTasting: WineTasting;

    private _yearSelectedIndex: number;
    private _wineTypeSelectedIndex: number;

    public get hasBubbles() {
        return this._hasBubbles;
    }
    public set hasBubbles(value) {
        this._hasBubbles = value;
        this.notifyPropertyChange("hasBubbles", value);
    }

    public get hasTears() {
        return this._hasTears;
    }
    public set hasTears(value) {
        this._hasTears = value;
        this.notifyPropertyChange("hasTears", value);
    }

    public get wineTasting() {
        return this._wineTasting;
    }
    public set wineTasting(value) {
        this._wineTasting = value;
        this.notifyPropertyChange("wineTasting", value);
    }

    public get limpidityCriterias() {
        return this._limpidityCriterias;
    }
    public set limpidityCriterias(value) {
        this._limpidityCriterias = value;
        this.notifyPropertyChange("limpidityCriterias", value);
    }

    public get smellIntensityCriterias() {
        return this._smellIntensityCriterias;
    }
    public set smellIntensityCriterias(value) {
        this._smellIntensityCriterias = value;
        this.notifyPropertyChange("smellIntensityCriterias", value);
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

    public get sightIntensityCriterias() {
        return this._sightIntensityCriterias;
    }
    public set sightIntensityCriterias(value) {
        this._sightIntensityCriterias = value;
        this.notifyPropertyChange("sightIntensityCriterias", value);
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

    public get yearSelectedIndex() {
        return this._yearSelectedIndex;
    }
    public set yearSelectedIndex(value: number) {
        this._yearSelectedIndex = value;
        this.wineTasting.year = this.years[value];
        this.notifyPropertyChange("yearSelectedIndex", value);
    }

    public get wineTypeSelectedIndex() {
        return this._wineTypeSelectedIndex;
    }
    public set wineTypeSelectedIndex(value: number) {
        this._wineTypeSelectedIndex = value;
        this.notifyPropertyChange("wineTypeSelectedIndex", value);

        this.wineTasting.wineType = this._wineTypes[value];
        this.wineTasting.color = null;
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

        this._service = Services.current;

        this._service.getLimpidityCriteriasAsync()
            .then(data => this.limpidityCriterias = data);
        this._service.getSightIntensityCriteriasAsync()
            .then(data => this.sightIntensityCriterias = data);
        this._service.getSmellIntensityCriteriasAsync()
            .then(data => this.smellIntensityCriterias = data);
        this._service.getTearCriteriasAsync()
            .then(data => this.tearCriterias = data);
        this._service.getBubbleCriteriasAsync()
            .then(data => this.bubbleCriterias = data);
        this._service.getWineTypesAsync()
            .then(data => {
                this.wineTypes = data;
                this.wineTypeSelectedIndex = 2;
            });
        this._service.getYearsAsync()
            .then(data => {
                this.years = data;
                this.yearSelectedIndex = data.length - 3;
            });

        this.wineTasting = {
            startDate: Date.now()
        };
        this.alcoholValue = 0;
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
}
