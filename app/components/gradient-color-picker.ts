import {WrapLayout} from "ui/layouts/wrap-layout";
import {Button} from "ui/button";
import {Color} from "color";
import dependencyObservableModule = require("ui/core/dependency-observable");

// https://github.com/NativeScript/NativeScript/issues/1252

export class GradientColorPicker extends WrapLayout {
    public static startingColorProperty = new dependencyObservableModule.Property(
        "startingColor",
        "GradientColorPicker",
        new dependencyObservableModule.PropertyMetadata(null, dependencyObservableModule.PropertyMetadataSettings.None));

    public static endingColorProperty = new dependencyObservableModule.Property(
        "endingColor",
        "GradientColorPicker",
        new dependencyObservableModule.PropertyMetadata(null, dependencyObservableModule.PropertyMetadataSettings.None));

    public static colorCountProperty = new dependencyObservableModule.Property(
        "colorCount",
        "GradientColorPicker",
        new dependencyObservableModule.PropertyMetadata(null, dependencyObservableModule.PropertyMetadataSettings.None));

    public get startingColor() {
        return this._getValue(GradientColorPicker.startingColorProperty);
    }
    public set startingColor(value: string) {
        this._setValue(GradientColorPicker.startingColorProperty, value);
    }

    public get endingColor() {
        return this._getValue(GradientColorPicker.endingColorProperty);
    }
    public set endingColor(value: string) {
        this._setValue(GradientColorPicker.endingColorProperty, value);
    }

    public get colorCount() {
        return this._getValue(GradientColorPicker.colorCountProperty);
    }
    public set colorCount(value: number) {
        this._setValue(GradientColorPicker.colorCountProperty, value);
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
