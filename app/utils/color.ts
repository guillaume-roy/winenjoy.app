export class ColorUtils {
    public static rgbToHex(rgb) {
        return ColorUtils.hex(rgb[0]) + ColorUtils.hex(rgb[1]) + ColorUtils.hex(rgb[2]);
    }

    public static convertToRGB(hex) {
        let color = [];
        color[0] = parseInt ((ColorUtils.trimHexValue(hex)).substring (0, 2), 16);
        color[1] = parseInt ((ColorUtils.trimHexValue(hex)).substring (2, 4), 16);
        color[2] = parseInt ((ColorUtils.trimHexValue(hex)).substring (4, 6), 16);
        return color;
    }

    public static getForegroundColor(backgroundColor: string) {
        // http://stackoverflow.com/a/3943023/1134380
        if (!backgroundColor) {
            return null;
        }

        let rgbColor = ColorUtils.convertToRGB(backgroundColor);
        for (let c = 0; c < rgbColor.length; c++) {
            rgbColor[c] = rgbColor[c] / 255.0;
            if (rgbColor[c] <= 0.03928) {
                rgbColor[c] = rgbColor[c] / 12.92;
            } else {
                rgbColor[c] = Math.pow((rgbColor[c] + 0.055) / 1.055, 2.4);
            }
        }

        let luminance = 0.2126 * rgbColor[0] + 0.7152 * rgbColor[1] + 0.0722 * rgbColor[2];
        if (luminance > 0.179) {
            return "#000000";
        } else {
            return "#ffffff";
        }
    }

    private static hex (c) {
        let s = "0123456789abcdef";
        let i = parseInt(c);
        if (i === 0 || isNaN (c)) {
            return "00";
        }
        i = Math.round (Math.min (Math.max (0, i), 255));
        return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
    }

    private static trimHexValue(s) {
        return (s.charAt(0) === "#")
            ? s.substring(1, 7)
            : s;
    }
}
