import {EventData} from "data/observable";
import {Page} from "ui/page";
import {EditTastingViewModel} from "../../view-models/edit-tasting-view-model";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");
import {Views} from "../../utils/views";
import geolocation = require("nativescript-geolocation");

let viewModel: EditTastingViewModel;
let page: Page;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    setTimeout(() => {
       viewModel = new EditTastingViewModel();
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

export function onSaveTasting() {
    viewModel.validateForm();

    if (viewModel.formIsValid) {
        viewModel.finishTasting();

        frameModule.topmost().navigate({
            animated: false,
            backstackVisible: false,
            moduleName: Views.main
        });
    } else {
        dialogs.alert({
            message: "Vous devez indiquer au moins : un nom de cuvée, un domaine, une région ou un pays.",
            okButtonText: "OK",
            title: "Erreur"
        }).then(function() {
            viewModel.tabSelectedIndex = 0;
        });
    }
}

export function onSelectColor() {
    page.showModal(
        Views.gradientColorPickerModal,
        viewModel.wineTasting,
        function(selectedColor) {
            viewModel.wineTasting.color = selectedColor;
            viewModel.notifyPropertyChange("wineTasting", viewModel.wineTasting);
        },
        false);
}

export function onAddAromas() {
    page.showModal(
        Views.aromasPicker,
        {
            isDefects: false,
            values: viewModel.wineTasting.aromas
        },
        function(data) {
            viewModel.setAromas(data);
        },
        true);
}

export function onAddDefects() {
    page.showModal(
        Views.aromasPicker,
        {
            isDefects: true,
            values: viewModel.wineTasting.defects
        },
        function(data) {
            viewModel.setDefects(data);
        },
        true);
}

export function cancel() {
    dialogs.confirm({
        cancelButtonText: "Non",
        message: "Etes-vous sûr de vouloir annuler cette dégustation ?",
        okButtonText: "Oui",
        title: "Annuler"
    }).then(result => {
        if (result) {
            frameModule.topmost().navigate({
                animated: false,
                backstackVisible: false,
                moduleName: Views.main
            });
        }
    });
}
