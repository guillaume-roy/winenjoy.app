import {EventData} from "data/observable";
import {Page} from "ui/page";
import {TastingViewModel} from "../../view-models/tasting-view-model";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");
import appModule = require("application");
import {Views} from "../../utils/views";
import geolocation = require("nativescript-geolocation");
import socialShare = require("nativescript-social-share");

let viewModel: TastingViewModel;
let page: Page;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    setTimeout(() => {
       viewModel = new TastingViewModel(page.navigationContext);
        page.bindingContext = viewModel;
        if (geolocation.isEnabled() && !viewModel.isEditMode) {
            geolocation.getCurrentLocation({timeout: 5000}).
            then(function(loc) {
                viewModel.wineTasting.latitude = loc.latitude;
                viewModel.wineTasting.longitude = loc.longitude;
                viewModel.wineTasting.altitude = loc.altitude;
            });
        }
    });
}

export function onDeleteTasting() {
    dialogs.confirm({
        cancelButtonText: "Non",
        message: "Etes-vous sûr de vouloir supprimer cette dégustation ?",
        okButtonText: "Oui",
        title: "Supprimer"
    }).then(result => {
        if (result) {
            viewModel.deleteTasting();
            frameModule.topmost().navigate({
                animated: false,
                backstackVisible: false,
                moduleName: Views.main
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
        viewModel.tabSelectedIndex = 0;
        setTimeout(() => {
            let field = page.getViewById("cuvee-field");
            field.animate({
                curve: "spring",
                duration: 100,
                translate: {
                    x: -50,
                    y: 0
                }
            }).then(() => {
                field.animate({
                    curve: "spring",
                    duration: 100,
                    translate: {
                        x: 50,
                        y: 0
                    }
                }).then(() => {
                    field.animate({
                        curve: "spring",
                        duration: 100,
                        translate: {
                            x: -40,
                            y: 0
                        }
                    }).then(() => {
                        field.animate({
                            curve: "spring",
                            duration: 100,
                            translate: {
                                x: 20,
                                y: 0
                            }
                        }).then(() => {
                            field.animate({
                                curve: "spring",
                                duration: 100,
                                translate: {
                                    x: 0,
                                    y: 0
                                }
                            });
                        });
                    });
                });
            });
        }, 10);
    }
}

export function onShareTasting() {
    let shareMessage = viewModel.getShareMessage();
    socialShare.shareText(shareMessage, "Partager ma dégustation");
}

export function onSelectColor() {
    page.showModal(
        Views.gradientColorPickerModal,
        viewModel.wineTasting,
        function(selectedColor) {
            viewModel.wineTasting.color = selectedColor;
            viewModel.notifyPropertyChange("wineTasting", viewModel.wineTasting);
        },
        true);
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

export function cancel(args: any) {
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
            args.cancel = !result;
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

let dateConverterKey = "dateConverter";
appModule.resources[dateConverterKey] = function(value) {
    let date = new Date(value);
    let day = date.getDate();
    let month = date.getMonth();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return (day < 10 ? "0" + day : day) + "/" + (month < 10 ? "0" + month : month) + "/" + date.getFullYear() +
        " " + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
};

let labelConverterKey = "labelConverter";
appModule.resources[labelConverterKey] = function(value) {
    if (value && value.length > 0) {
        return value.map(v => {
            return v.label;
        });
    } else {
        return [];
    }
};
