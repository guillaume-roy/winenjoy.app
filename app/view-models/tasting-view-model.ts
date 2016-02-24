import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";

export class TastingViewModel extends Observable {
    private _wineTasting: WineTasting;
    private _yearsSelection: number[];
    private _yearSelectedIndex: number;
    private _wineTypesSelection: string[];
    private _wineTypeSelectedIndex: number;
    private _alcoholValue: number;

    public get wineTasting() {
        return this._wineTasting;
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
    }

    public get alcoholValue() {
        return this._alcoholValue;
    }
    public set alcoholValue(value: number) {
        this._alcoholValue = value;
        this.notifyPropertyChange("alcoholValue", value);
    }

    constructor() {
        super();

        this._yearsSelection = [];
        for (let i = 1900; i <= 2016; i++) {
            this._yearsSelection.push(i);
        }
        this._yearSelectedIndex = this._yearsSelection.length - 3;

        this._wineTypesSelection = [ "Blanc", "Rosé", "Rouge" ];
        this._wineTypeSelectedIndex = 2;

        this._alcoholValue = 14.4;
    }
}
