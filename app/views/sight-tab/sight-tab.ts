import {EventData} from "data/observable";
import {Page} from "ui/page";
import {SightTabViewModel} from "../../view-models/sight-tab-view-model";
import {Views} from "../../utils/views";
import geolocation = require("nativescript-geolocation");
import editTastingUtils = require("../../utils/edit-tasting");

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

        editTastingUtils.manageFabVisibility("scrollView", "fab", "fab-delete", page);
    });
}

export function navigatedFrom() {
    editTastingUtils.navigatedFrom(viewModel);
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
    editTastingUtils.saveTasting(viewModel);
}

export function deleteTasting() {
    editTastingUtils.deleteTasting(viewModel);
}
