import {EventData} from "data/observable";
import {Page} from "ui/page";
import {EditTastingViewModel} from "../../view-models/edit-tasting-view-model";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");
import {Views} from "../../utils/views";
import geolocation = require("nativescript-geolocation");

let viewModel: EditTastingViewModel;
let page: Page;

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
