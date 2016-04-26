import application = require("application");
import {Views} from "./utils/views";
import {UserService} from "./services/userService";
import {AnalyticsService} from "./services/analyticsService";

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
            result = value.region;
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

let analyticsService = new AnalyticsService();

application.on(application.launchEvent, args => {
    analyticsService.initialize();
});

application.on(application.uncaughtErrorEvent, (args: application.ApplicationEventData) => {
    console.log(args.object);
    analyticsService.logException(true);
});

 application.start({
    moduleName: new UserService().isLogged() ? Views.main : Views.login
});
