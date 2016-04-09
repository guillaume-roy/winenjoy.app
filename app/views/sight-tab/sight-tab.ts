import {EventData} from "data/observable";
import {Page} from "ui/page";
import {SightTabViewModel} from "../../view-models/sight-tab-view-model";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");
import {Views} from "../../utils/views";
import geolocation = require("nativescript-geolocation");

let viewModel: SightTabViewModel;
let page: Page;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    setTimeout(() => {
       viewModel = new SightTabViewModel(page.navigationContext);
        page.bindingContext = viewModel;
        if (geolocation.isEnabled()) {
            geolocation.getCurrentLocation({timeout: 5000}).
            then(function(loc) {
                viewModel.wineTasting.latitude = loc.latitude;
                viewModel.wineTasting.longitude = loc.longitude;
                viewModel.wineTasting.altitude = loc.altitude;
            });
        }
    });
}