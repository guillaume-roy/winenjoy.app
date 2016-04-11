import {EventData} from "data/observable";
import {Page} from "ui/page";
import {SightTabViewModel} from "../../view-models/sight-tab-view-model";
import {Views} from "../../utils/views";
import geolocation = require("nativescript-geolocation");
import scrollViewModule = require("ui/scroll-view");
import frameModule = require("ui/frame");

let viewModel: SightTabViewModel;
let page: Page;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    setTimeout(() => {
       viewModel = new SightTabViewModel();
        page.bindingContext = viewModel;
        if (geolocation.isEnabled() && !viewModel.isEditMode) {
            geolocation.getCurrentLocation({timeout: 5000}).
            then(function(loc) {
                viewModel.wineTasting.latitude = loc.latitude;
                viewModel.wineTasting.longitude = loc.longitude;
                viewModel.wineTasting.altitude = loc.altitude;
            });
        }

        manageFabVisibility();
    });
}

export function navigatedFrom() {
    viewModel.storeTasting();
}

export function onSelectColor() {
    page.showModal(
        Views.gradientColorPicker,
        viewModel.wineTasting,
        function(selectedColor) {
            viewModel.wineTasting.color = selectedColor;
            viewModel.notifyPropertyChange("wineTasting", viewModel.wineTasting);
        },
        false);
}

export function onDeleteColor() {
    viewModel.wineTasting.color = null;
    viewModel.notifyPropertyChange("wineTasting", viewModel.wineTasting);
}

export function saveTasting() {
    viewModel.saveTasting();

    frameModule.topmost().navigate({
        animated: false,
        backstackVisible: false,
        clearHistory: true,
        moduleName: Views.main
    });
}

function manageFabVisibility() {
    let scrollView = page.getViewById("scrollView");
    scrollView.on("scroll", (scrollEvent: scrollViewModule.ScrollEventData) => {
        let src = page.getViewById("fab");
        if (scrollEvent.scrollY !== 0) {
            src.animate({
                duration: 300,
                translate: {
                    x: 200,
                    y: 0
                }
            });
        } else {
            src.animate({
                duration: 300,
                translate: {
                    x: 0,
                    y: 0
                }
            });
        }
    });
}
