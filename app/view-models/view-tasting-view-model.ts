import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";
import {TastingsService} from "../services/tastingsService";

export class ViewTastingViewModel extends Observable {
    private _wineTasting: WineTasting;
    private _alcoholValue: number;

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

    public deleteTasting() {
        new TastingsService().deleteTasting(this.wineTasting);
    }
}
