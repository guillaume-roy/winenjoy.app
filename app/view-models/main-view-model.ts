import {Observable} from "data/observable";

export class MainViewModel extends Observable {
    private _clickMeLabel: string;
    private _clickedLabel: string;

    public get clickMeLabel() {
        return this._clickMeLabel;
    }
    public set clickMeLabel(value: string) {
        this._clickMeLabel = value;
        this.notifyPropertyChange("clickMeLabel", value);
    }

    public get clickedLabel() {
        return this._clickedLabel;
    }
    public set clickedLabel(value: string) {
        this._clickedLabel = value;
        this.notifyPropertyChange("clickedLabel", value);
    }

    constructor() {
        super();

        this.clickMeLabel = "Click me";
    }

    public click() {
        this.clickedLabel = "Clicked !";
    }
}
