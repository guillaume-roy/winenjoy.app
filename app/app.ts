import application = require("application");
import {Views} from "./utils/views";
import {AnalyticsService} from "./services/analyticsService";
import {UserService} from "./services/userService";
import frameModule = require("ui/frame");
import {Converters} from "./utils/converters";

Converters.attach();

let analyticsService = new AnalyticsService();

application.onLaunch = (context: any) => {
    analyticsService.initialize();
};

application.onUncaughtError = (error: any) => {
    console.dump(error);
    analyticsService.logException(null, true);
};

let userService = new UserService();
userService.initAuthentication().then(loggedIn => {
    if (loggedIn) {
        userService.updateLastConnectionDate();
        frameModule.topmost().navigate({
            animated: false,
            backstackVisible: true,
            moduleName: Views.main
        });
    }
});

application.mainModule = Views.login;
application.start();
