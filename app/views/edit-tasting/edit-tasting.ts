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
       viewModel = new EditTastingViewModel(page.navigationContext);
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

export function onSelectGrapes() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "grapes",
            searchBarHintText: "Rechercher un cépage",
            selectedItems: viewModel.wineTasting.grapes
        },
        function(selectedGrapes) {
            viewModel.setGrapes(selectedGrapes);
        },
        true);
}

export function onSelectColor() {
    page.showModal(
        Views.gradientColorPicker,
        viewModel.wineTasting,
        function(selectedColor) {
            console.log("here");
            viewModel.wineTasting.color = selectedColor;
            viewModel.notifyPropertyChange("wineTasting", viewModel.wineTasting);
        },
        false);
}

export function onDeleteColor() {
    viewModel.wineTasting.color = null;
    viewModel.notifyPropertyChange("wineTasting", viewModel.wineTasting);
}

export function onSelectCountry() {
    page.showModal(
        Views.groupingListPicker,
        {
            criterias: "geo",
            groupingIcon: "public",
            multiple: false,
            searchBarHintText: "Sélectionez un pays"
        },
        function(data) {
            viewModel.setCountry(data);
        },
        true);
}

export function onDeleteCountry() {
    viewModel.setCountry(null);
}

export function onSelectYear() {
    page.showModal(
        Views.yearPicker,
        viewModel.wineTasting.year,
        function(data) {
            viewModel.setYear(data);
        },
        false);
}

export function onDeleteYear() {
    viewModel.setYear(null);
}

export function onAddAromas() {
    page.showModal(
        Views.groupingListPicker,
        {
            criterias: "aromas",
            groupingIcon: "whatshot",
            multiple: true,
            searchBarHintText: "Sélectionez des arômes",
            selectedItems: viewModel.wineTasting.aromas
        },
        function(data) {
            viewModel.setAromas(data);
        },
        true);
}

export function onAddDefects() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "aromas",
            searchBarHintText: "Rechercher un défaut",
            selectedItems: viewModel.wineTasting.defects
        },
        function(items) {
            viewModel.setDefects(items);
        },
        true);
}

export function cancel() {
    if (viewModel.isEditMode) {
        frameModule.topmost().navigate({
            animated: false,
            backstackVisible: false,
            moduleName: Views.main
        });
    } else {
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
}
