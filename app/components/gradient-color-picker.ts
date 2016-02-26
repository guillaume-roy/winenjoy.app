import {WrapLayout} from "ui/layouts/wrap-layout";
import {Button} from "ui/button";
import {Color} from "color";

// https://github.com/NativeScript/NativeScript/issues/1252

export class GradientColorPicker extends WrapLayout {
    private _startingColor: string;
    private _endingColor: string;
    private _colorCount: number;

    public get startingColor() {
        return this._startingColor;
    }
    public set startingColor(value: string) {
        this._startingColor = value;
    }

    public get endingColor() {
        return this._endingColor;
    }
    public set endingColor(value: string) {
        this._endingColor = value;
    }

    public get colorCount() {
        return this._colorCount;
    }
    public set colorCount(value: number) {
        this._colorCount = value;
    }

    constructor() {
        super();
    }

    public generateGradient() {
        let startingColorRgb = this.convertToRGB(this.startingColor);
        let endingColorRgb = this.convertToRGB(this.endingColor);
        let alpha = 0.0;

        let result = [];

        for (let i = 0; i < this.colorCount; i++) {
            let gradientColor = [];
            alpha += (1.0 / this.colorCount);

            gradientColor[0] = startingColorRgb[0] * alpha + (1 - alpha) * endingColorRgb[0];
            gradientColor[1] = startingColorRgb[1] * alpha + (1 - alpha) * endingColorRgb[1];
            gradientColor[2] = startingColorRgb[2] * alpha + (1 - alpha) * endingColorRgb[2];

            result.push(this.rgbToHex(gradientColor));
        }

        this.displayGradient(result.reverse());
    }

    private displayGradient(gradient: any[]) {
        let resultLength = gradient.length;

        for (let i = 0; i < resultLength; i++) {
            let gradientButton = new Button();
            gradientButton.backgroundColor = new Color("#" + gradient[i]);
            gradientButton.height = 72;
            gradientButton.width = 72;

            this.addChild(gradientButton);
        }
    }

    private hex (c) {
        let s = "0123456789abcdef";
        let i = parseInt(c);
        if (i === 0 || isNaN (c)) {
            return "00";
        }
        i = Math.round (Math.min (Math.max (0, i), 255));
        return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
    }

    private rgbToHex(rgb) {
        return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
    }

    private trimHexValue(s) {
        return (s.charAt(0) === "#")
            ? s.substring(1, 7)
            : s;
    }

    private convertToRGB(hex) {
        let color = [];
        color[0] = parseInt ((this.trimHexValue(hex)).substring (0, 2), 16);
        color[1] = parseInt ((this.trimHexValue(hex)).substring (2, 4), 16);
        color[2] = parseInt ((this.trimHexValue(hex)).substring (4, 6), 16);
        return color;
    }
}
