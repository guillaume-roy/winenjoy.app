import application = require("application");
import {Views} from "./utils/views";
import {AnalyticsService} from "./services/analyticsService";
import {ImageSource} from "image-source";

application.resources.finalRatingToImageConverter = function(value: any) {
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
};

application.resources.wineLocationConverter = function(value: any) {
    if (!value) {
        return null;
    }

    let result = "";

    if (value.region || value.country) {
        if (value.region) {
            result = value.region.Label;
        }

        if (value.country) {
            if (result.length > 0) {
              result = result + " - " + value.country.label;
            } else {
                result = value.country.label;
            }
        }
    }

    return result;
};

application.resources.base64ToImageConverter = function(base64Image: string) {
    if (!base64Image) {
        return null;
    }

    let imageSource = new ImageSource();
    imageSource.loadFromBase64(base64Image);

    return imageSource;
};

let analyticsService = new AnalyticsService();

application.onLaunch = (context: any) => {
    analyticsService.initialize();
};

application.onUncaughtError = (error: any)  => {
    analyticsService.logException(null, true);
};

 application.start({
    moduleName: Views.main
});
