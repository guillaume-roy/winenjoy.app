import application = require("application");
import {WineTasting} from "../entities/wineTasting";

export class Converters {
    public static attach() {
        application.resources.regionConverterConverter = Converters.regionConverterConverter;
        application.resources.visibilityConverter = Converters.visibilityConverter;
        application.resources.finalRatingToImageConverter = Converters.finalRatingToImageConverter;
    }

    private static regionConverterConverter(value: WineTasting) {
        let regionIsEmpty = _.isEmpty(value.region);
        let countryIsEmpty = _.isEmpty(value.country);

        if (regionIsEmpty && countryIsEmpty) {
            return "";
        } else if (!regionIsEmpty && !countryIsEmpty) {
            return value.region.label + " - " + value.country.label;
        } else if (!regionIsEmpty) {
            return value.region.label;
        } else {
            return value.country.label;
        }
    }

    private static visibilityConverter(value: any) {
        return _.isEmpty(value)
            ? "collapse"
            : "visible";
    }

    private static finalRatingToImageConverter(value: any) {
        if (!value) {
            return null;
        }

        let result = "";

        switch (parseInt(value, 10)) {
            case 0:
                result = "sentiment_very_dissatisfied";
                break;
            case 1:
                result = "sentiment_dissatisfied";
                break;
            case 2:
                result = "sentiment_neutral";
                break;
            case 3:
                result = "sentiment_satisfied";
                break;
            case 4:
                result = "sentiment_very_satisfied";
                break;
        }

        return result;
    }
}