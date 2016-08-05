import application = require("application");
import {Views} from "./utils/views";
import {AnalyticsService} from "./services/analyticsService";
import {UserService} from "./services/userService";
import {WineTasting} from "./entities/wineTasting";
import _ = require("lodash");
import frameModule = require("ui/frame");

application.resources.regionConverterConverter = (value: WineTasting) => {
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

application.resources.visibilityConverter = (value: any) => (_.isEmpty(value)
    ? "collapse"
    : "visible");

application.resources.finalRatingToImageConverter = (value: any) => {
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

let analyticsService = new AnalyticsService();

application.onLaunch = (context: any) => {
    analyticsService.initialize();
};

application.onUncaughtError = (error: any)  => {
    analyticsService.logException(null, true);
};

let userService = new UserService();
userService.initAuthentication().then(loggedIn => {
    if (loggedIn) {
        userService.updateLastConnectionDate();
        frameModule.topmost().navigate({
            animated: false,
            backstackVisible: true,
            moduleName: Views.finalStep
        });
    }
});

application.start({
    moduleName: Views.main
});
