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

    private _wineTasting: WineTasting;

    private _yearSelectedIndex: number;
    private _wineTypeSelectedIndex: number;

    public get wineTasting() {
        return this._wineTasting;
    }

    public get limpidityCriterias() {
        return this._limpidityCriterias;
    }

    public get smellIntensityCriterias() {
        return this._smellIntensityCriterias;
    }

    public get tearCriterias() {
        return this._tearCriterias;
    }

    public get bubbleCriterias() {
        return this._bubbleCriterias;
    }

    public get sightIntensityCriterias() {
        return this._sightIntensityCriterias;
    }

    public get wineTypes() {
        return this._wineTypes.map((value: CriteriaItem) => {
           return value.label;
        });
    }

    public get years() {
        return this._years;
    }

    public get yearSelectedIndex() {
        return this._yearSelectedIndex;
    }
    public set yearSelectedIndex(value: number) {
        this._yearSelectedIndex = value;
        this.notifyPropertyChange("yearSelectedIndex", value);

        this.wineTasting.year = this._years[value];
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
        this._limpidityCriterias = this._service.getLimpidityCriterias();
        this._sightIntensityCriterias = this._service.getSightIntensityCriterias();
        this._smellIntensityCriterias = this._service.getSmellIntensityCriterias();
        this._tearCriterias = this._service.getTearCriterias();
        this._bubbleCriterias = this._service.getBubbleCriterias();
        this._wineTypes = this._service.getWineTypes();
        this._years = this._service.getYears();

        this._yearSelectedIndex = this._years.length - 3;
        this._wineTasting = {
            startDate: Date.now(),
            wineType: 2,
            year: this._years[this._yearSelectedIndex]
        };
    }

    public finishTasting() {
        this.wineTasting.endDate = Date.now();
        console.dump(this.wineTasting);
    }
}
