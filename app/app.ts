import application = require("application");
import {Views} from "./utils/views";
import frame = require("ui/frame");
import appSettings = require("application-settings");

application.start({
    moduleName: appSettings.hasKey("userInformations") ? Views.main : Views.login
});

if (application.android) {
    application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
}

function backEvent(args) {
    let currentPage = frame.topmost().currentPage;
    if (currentPage && currentPage.exports && typeof currentPage.exports.backEvent === "function") {
         currentPage.exports.backEvent(args);
   }
}
