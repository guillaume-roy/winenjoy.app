import {Observable} from "data/observable";

export class MainViewModel extends Observable {
    private _tastings: any[];

    public get tastings() {
        return this._tastings;
    }
    public set tastings(value) {
        this._tastings = value;
        this.notifyPropertyChange("tastings", value);
    }

    constructor() {
        super();

        this.tastings = [];
    }
}
