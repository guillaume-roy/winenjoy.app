import {Page, NavParams, ViewController} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/colors-modal/colors-modal.html'
})
export class ColorsModal {
    static get parameters() {
        return [[NavParams], [ViewController]];
    }

    constructor(navParams, viewController) {
        this.navParams = navParams;
        this.viewController = viewController;

        this.wineType = this.navParams.get('wineType');

        this.gradients = [];

        switch (this.wineType) {
            case "WHITE" :
                this.gradients = this.generateGradient("#FDF3C2", "#F0C636", 20);
            break;
            case "ROSE" :
                this.gradients = this.generateGradient("#F7C7B1", "#BF3E2B", 20);
            break;
            case "RED" :
                this.gradients = this.generateGradient("#C23311", "#3B022D", 20);
            break;
        }
    }

    selectColor(gradient) {
        this.viewController.dismiss(gradient);
    }

    generateGradient(startingColor, endingColor, colorsCount) {
        if (startingColor && endingColor && colorsCount > 0) {
            let startingColorRgb = this.convertToRGB(startingColor);
            let endingColorRgb = this.convertToRGB(endingColor);

            let alpha = 0.0;

            let result = [];

            for (let i = 0; i < colorsCount; i++) {
                let gradientColor = [];
                alpha += (1.0 / colorsCount);

                gradientColor[0] = startingColorRgb[0] * alpha + (1 - alpha) * endingColorRgb[0];
                gradientColor[1] = startingColorRgb[1] * alpha + (1 - alpha) * endingColorRgb[1];
                gradientColor[2] = startingColorRgb[2] * alpha + (1 - alpha) * endingColorRgb[2];

                result.push('#' + this.rgbToHex(gradientColor));
            }

            return result;
        }
        return [];
    }

    hex(c) {
        let s = "0123456789abcdef";
        let i = parseInt(c);
        if (i === 0 || isNaN (c)) {
            return "00";
        }
        i = Math.round (Math.min (Math.max (0, i), 255));
        return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
    }

    rgbToHex(rgb) {
        return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
    }

    trimHexValue(s) {
        return (s.charAt(0) === "#")
            ? s.substring(1, 7)
            : s;
    }

    convertToRGB(hex) {
        let color = [];
        color[0] = parseInt ((this.trimHexValue(hex)).substring (0, 2), 16);
        color[1] = parseInt ((this.trimHexValue(hex)).substring (2, 4), 16);
        color[2] = parseInt ((this.trimHexValue(hex)).substring (4, 6), 16);
        return color;
    }
}
