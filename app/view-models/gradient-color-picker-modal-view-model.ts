import {Observable} from "data/observable";
import {WineTasting} from "../entities/wineTasting";

export class GradientColorPickerModalViewModel extends Observable {
    private _selectedColor: string;
    private _wineTasting: WineTasting;

    public get selectedColor() {
        return this._selectedColor;
    }
    public set selectedColor(value: string) {
        this._selectedColor = value;
        this.notifyPropertyChange("selectedColor", value);
    }

    public get wineTasting() {
        return this._wineTasting;
    }

    constructor(wineTasting: WineTasting) {
        super();

        this._wineTasting = wineTasting;
    }
}
