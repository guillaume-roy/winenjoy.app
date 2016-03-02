import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";

export class TastingViewModel extends Observable {
    private _wineTasting: WineTasting;
    private _yearsSelection: number[];
    private _yearSelectedIndex: number;
    private _wineTypesSelection: string[];
    private _wineTypeSelectedIndex: number;
    private _alcoholValue: number;
    private _alcoholFromattedValue: number;
    private _limpidityValues: any;

    public get wineTasting() {
        return this._wineTasting;
    }

    public get limpidityValues() {
        return this._limpidityValues;
    }

    public get yearsSelection() {
        return this._yearsSelection;
    }

    public get wineTypesSelection() {
        return this._wineTypesSelection;
    }

    public get yearSelectedIndex() {
        return this._yearSelectedIndex;
    }
    public set yearSelectedIndex(value: number) {
        this._yearSelectedIndex = value;
        this.notifyPropertyChange("yearSelectedIndex", value);

        this.wineTasting.year = this.yearsSelection[value];
    }

    public get wineTypeSelectedIndex() {
        return this._wineTypeSelectedIndex;
    }
    public set wineTypeSelectedIndex(value: number) {
        this._wineTypeSelectedIndex = value;
        this.notifyPropertyChange("wineTypeSelectedIndex", value);

        this.wineTasting.wineType = value;
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

        this._wineTasting = {
            alcohol: 13,
            startDate: Date.now(),
            wineType: 2
        };

        this._yearsSelection = [];
        for (let i = 1900; i <= 2016; i++) {
            this._yearsSelection.push(i);
        }
        this._yearSelectedIndex = this._yearsSelection.length - 3;

        this._wineTypesSelection = [ "Blanc", "Rosé", "Rouge" ];
        this._wineTypeSelectedIndex = 2;

        this.alcoholValue = 130;

        this._limpidityValues = [
            {
                id: 0,
                order: 0,
                text: "Net"
            },
            {
                id: 1,
                order: 1,
                text: "Trouble"
            },
            {
                id: 1,
                order: 1,
                text: "Flou"
            },
            {
                id: 1,
                order: 1,
                text: "Limpide"
            },
            {
                id: 1,
                order: 1,
                text: "Cristallin"
            },
            {
                id: 1,
                order: 1,
                text: "Voilé"
            }
        ];
    }

    public finishTasting() {
        this.wineTasting.endDate = Date.now();
        console.dump(this.wineTasting);
    }
}
