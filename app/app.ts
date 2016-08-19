import application = require("application");
import {Views} from "./utils/views";
import {AnalyticsService} from "./services/analyticsService";
import {UserService} from "./services/userService";
import frameModule = require("ui/frame");
import {Converters} from "./utils/converters";
import profiler = require("./utils/profiling");

Converters.attach();

let analyticsService = new AnalyticsService();

application.onLaunch = (context: any) => {
    analyticsService.initialize();
};

application.onUncaughtError = (error: any)  => {
    analyticsService.logException(null, true);
};

//let userService = new UserService();
//userService.initAuthentication().then(loggedIn => {
//    if (loggedIn) {
//        userService.updateLastConnectionDate();
//        frameModule.topmost().navigate({
//            animated: false,
//            backstackVisible: true,
//            moduleName: Views.allInOne
//        });
//    }
//});

profiler.start("main-page");
application.mainModule = Views.allInOne;
application.start();
