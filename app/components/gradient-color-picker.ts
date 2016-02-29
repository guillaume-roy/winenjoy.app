import {WrapLayout} from "ui/layouts/wrap-layout";
import {EventData} from "data/observable";
import {Button} from "ui/button";
import {Color} from "color";
import dependencyObservableModule = require("ui/core/dependency-observable");

export class GradientColorPicker extends WrapLayout {
    public static startingColorProperty = new dependencyObservableModule.Property(
        "startingColor",
        "GradientColorPicker",
        new dependencyObservableModule.PropertyMetadata(undefined, dependencyObservableModule.PropertyMetadataSettings.None));

    public static endingColorProperty = new dependencyObservableModule.Property(
        "endingColor",
        "GradientColorPicker",
        new dependencyObservableModule.PropertyMetadata(undefined, dependencyObservableModule.PropertyMetadataSettings.None));

    public static colorsCountProperty = new dependencyObservableModule.Property(
        "colorsCount",
        "GradientColorPicker",
        new dependencyObservableModule.PropertyMetadata(undefined, dependencyObservableModule.PropertyMetadataSettings.None));

    public static selectedColorProperty = new dependencyObservableModule.Property(
        "selectedColor",
        "GradientColorPicker",
        new dependencyObservableModule.PropertyMetadata(undefined, dependencyObservableModule.PropertyMetadataSettings.None));

    public get startingColor() {
        return this._getValue(GradientColorPicker.startingColorProperty);
    }
    public set startingColor(value: string) {
        this._setValue(GradientColorPicker.startingColorProperty, value);
        this.generateGradient();
    }

    public get endingColor() {
        return this._getValue(GradientColorPicker.endingColorProperty);
    }
    public set endingColor(value: string) {
        this._setValue(GradientColorPicker.endingColorProperty, value);
        this.generateGradient();
    }

    public get colorsCount() {
        return this._getValue(GradientColorPicker.colorsCountProperty);
    }
    public set colorsCount(value: number) {
        this._setValue(GradientColorPicker.colorsCountProperty, value);
        this.generateGradient();
    }

    public get selectedColor() {
        return this._getValue(GradientColorPicker.selectedColorProperty);
    }
    public set selectedColor(value: string) {
        this._setValue(GradientColorPicker.selectedColorProperty, value);
    }

    private _gradientButtons: Button[];

    constructor() {
        super();

        this._gradientButtons = [];
    }

    private generateGradient() {
        if (this.startingColor && this.endingColor && this.colorsCount > 0) {
            let startingColorRgb = this.convertToRGB(this.startingColor);
            let endingColorRgb = this.convertToRGB(this.endingColor);

            let alpha = 0.0;

            let result = [];

            for (let i = 0; i < this.colorsCount; i++) {
                let gradientColor = [];
                alpha += (1.0 / this.colorsCount);

                gradientColor[0] = startingColorRgb[0] * alpha + (1 - alpha) * endingColorRgb[0];
                gradientColor[1] = startingColorRgb[1] * alpha + (1 - alpha) * endingColorRgb[1];
                gradientColor[2] = startingColorRgb[2] * alpha + (1 - alpha) * endingColorRgb[2];

                result.push(this.rgbToHex(gradientColor));
            }

            this.displayGradient(result.reverse());
        }
    }

    private displayGradient(gradient: any[]) {
        let resultLength = gradient.length;

        for (let i = 0; i < resultLength; i++) {
            let gradientButton = new Button();
            gradientButton.backgroundColor = new Color("#" + gradient[i]);
            gradientButton.color = new Color("white");
            gradientButton.height = 72;
            gradientButton.width = 72;

            gradientButton.on(Button.tapEvent, function(args: EventData) {
                let clickedButton = <Button>args.object;

                for (let i = 0; i < this._gradientButtons.length; i++) {
                    this._gradientButtons[i].text = "";
                }

                clickedButton.text = "✓";
                this.selectedColor = clickedButton.style.backgroundColor.hex;
            }, this);

            this._gradientButtons.push(gradientButton);
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
