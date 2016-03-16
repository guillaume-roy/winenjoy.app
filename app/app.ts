import application = require("application");
import {Views} from "./utils/views";
import frame = require("ui/frame");

application.start({
    moduleName: Views.main
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
