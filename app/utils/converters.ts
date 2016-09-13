import application = require("application");
import {WineTasting} from "../entities/wineTasting";
import moment = require("moment");
import platform = require("platform");

export class Converters {
    public static attach() {
        application.resources.regionConverterConverter = Converters.regionConverterConverter;
        application.resources.visibilityConverter = Converters.visibilityConverter;
        application.resources.notVisiblityConverter = Converters.notVisiblityConverter;
        application.resources.finalRatingToImageConverter = Converters.finalRatingToImageConverter;
        application.resources.displayDateConverter = Converters.displayDateConverter;
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

    private static notVisiblityConverter(value: any) {
        return !Converters.visibilityConverter(value);
    }

    private static visibilityConverter(value: any) {
        return _.isEmpty(value) || !value
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

    private static displayDateConverter(value: Date) {
        if (!value)
            return null;

        moment.locale(platform.device.language);
        return moment(value).format("L");
    }
}