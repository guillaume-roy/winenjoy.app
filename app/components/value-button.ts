import {Button} from "ui/button";

export class ValueButton extends Button {
    private _value: any;

    public get value() {
        return this._value;
    }
    public set value(value: any) {
        this._value = value;
    }

    constructor() {
        super();
    }
}