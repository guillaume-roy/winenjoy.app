import application = require("application");
import {Views} from "./utils/views";
import {AnalyticsService} from "./services/analyticsService";
import {UserService} from "./services/userService";
import {ImageSource} from "image-source";
import {WineTasting} from "./entities/wineTasting";
import _ = require("lodash");

application.resources.regionConverterConverter = function(value: WineTasting) {
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
};

application.resources.visibilityConverter = function(value: any) {
    return _.isEmpty(value)
        ? "collapse"
        : "visible";
};

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

let userService = new UserService();

 application.start({
    moduleName: userService.isLogged() ? Views.main : Views.login
});
