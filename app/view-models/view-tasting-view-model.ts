import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";
import {Services} from "../utils/services";

export class ViewTastingViewModel extends Observable {
    private _wineTasting: WineTasting;
    private _alcoholValue: number;
    private _alcoholFromattedValue: number;

    public get wineTasting() {
        return this._wineTasting;
    }
    public set wineTasting(value) {
        this._wineTasting = value;
        this.notifyPropertyChange("wineTasting", value);
    }

    public get alcoholValue() {
        return this._alcoholValue;
    }
    public set alcoholValue(value: number) {
        this._alcoholValue = value;
        this.notifyPropertyChange("alcoholValue", value);
    }

    constructor(wineTasting: WineTasting) {
        super();
        this.wineTasting = wineTasting;
        this.alcoholValue = this.wineTasting.alcohol * 10;
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
        Services.current.deleteWineTasting(this.wineTasting);
    }
}
