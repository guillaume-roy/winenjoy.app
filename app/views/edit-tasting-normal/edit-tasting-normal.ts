import {EventData} from "data/observable";
import {Page} from "ui/page";
import dialogs = require("ui/dialogs");
import camera = require("camera");
import editTastingViewModelModule = require("../../view-models/edit-tasting-view-model");
import {Views} from "../../utils/views";
import frameModule = require("ui/frame");
import application = require("application");
import {WineTastingMode} from "../../entities/wineTastingMode";

let page: Page;
let locationAutoComplete;
let viewModel: editTastingViewModelModule.EditTastingViewModel;
let busyModal: Page;
let isBusyIndicator = false;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;
    locationAutoComplete = page.getViewById("locationAutoComplete");
    viewModel = new editTastingViewModelModule.EditTastingViewModel(WineTastingMode.Normal);

    page.bindingContext = viewModel;

    if (locationAutoComplete.android) {
        locationAutoComplete.android.setHint("Pays, Région, AOC");
        locationAutoComplete.android.setHintTextColor(android.graphics.Color.parseColor("#727272"));
        locationAutoComplete.android.setTextSize(16);
    }
    
    setTimeout(() => {
        isBusy();
    }, 0);

    setTimeout(() => {
        viewModel.init()
            .then(() => {
                if (page.navigationContext) {
                    viewModel.load(page.navigationContext);

                    var aoc = viewModel.get("aoc");
                    var region = viewModel.get("region");
                    var country = viewModel.get("country");

                    if (aoc) {
                        locationAutoComplete.android.setText("AOC : " + aoc.label);
                    } else if (region) {
                        locationAutoComplete.android.setText("Région : " + region.label);
                    } else if (country) {
                        locationAutoComplete.android.setText("Pays : " + country.label);
                    }
                }

                attachBackButtonConfirmation();

                isBusy(true);
            })
            .catch(error => {
                console.dump(error);
                dialogs.alert({
                    message: "Erreur lors du chargement de la dégustation.",
                    okButtonText: "OK",
                    title: "Erreur"
                });
            });
    }, 0);
}

export function unloaded() {
    detachBackButtonConfirmation();
}

export function managePicture() {
    if (isBusyIndicator)
        return;

    if (viewModel.get("containsPicture")) {
        var args = {
            tastingId: null,
            img: null
        };

        if (viewModel.get("isEdit")) {
            if (viewModel.get("pictureEditMode") === "EDIT") {
                args.img = viewModel.get("picture");
            } else {
                args.tastingId = viewModel.get("editWineTasting").id;
            }
        } else {
            args.img = viewModel.get("picture");
        }

        page.showModal(
            Views.tastingPictureViewer,
            args,
            (deletePicture) => {
                if (deletePicture) {
                    viewModel.set("picture", null);
                    viewModel.set("containsPicture", false);
                    viewModel.set("pictureEditMode", "DELETE");
                }
            },
            true);
    } else {
        camera.takePicture({
            height: 800,
            keepAspectRatio: true,
            width: 800
        }).then(img => {
            viewModel.set("picture", img);
            viewModel.set("containsPicture", true);
            viewModel.set("pictureEditMode", "EDIT");
        });
    }
}

export function saveTasting() {
    if (isBusyIndicator)
        return;

    setTimeout(() => {
        isBusy();
    }, 0);

    var locationText = locationAutoComplete.android.getText();

    if (locationText) {
        locationText = locationText.toString();
    }

    setTimeout(() => {
        viewModel.saveTasting(locationText)
            .then(() => {
                isBusy(true);
                frameModule.topmost()
                    .navigate({
                        animated: false,
                        backstackVisible: false,
                        moduleName: Views.main
                    });
            }).catch(error => {
                isBusy(true);
                console.log("saveTasting ERROR");
                console.log(error.message);
                console.log(error.error);
                dialogs.alert({
                    message: "Erreur lors de l'enregistrement de la dégustation.",
                    okButtonText: "OK",
                    title: "Erreur"
                });
            });
    }, 0);
}

export function selectAromas() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "aromas",
            groupingIcon: "whatshot",
            multiple: true,
            searchBarHintText: "Sélectionez des arômes",
            selectedItems: viewModel.get("selectedAromas")
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.set("selectedAromas", null);
                viewModel.set("selectedAromas", data);
            }
        },
        true);
}

export function selectAromaDefects() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "aromaDefects",
            groupingIcon: "whatshot",
            multiple: true,
            searchBarHintText: "Sélectionez des défauts d'arôme",
            selectedItems: viewModel.get("selectedAromaDefects")
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.set("selectedAromaDefects", null);
                viewModel.set("selectedAromaDefects", data);
            }
        },
        true);
}

export function selectFlavors() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "aromas",
            groupingIcon: "whatshot",
            multiple: true,
            searchBarHintText: "Sélectionez des saveurs",
            selectedItems: viewModel.get("selectedFlavors")
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.set("selectedFlavors", null);
                viewModel.set("selectedFlavors", data);
            }
        },
        true);
}

export function selectFlavorDefects() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "aromaDefects",
            groupingIcon: "whatshot",
            multiple: true,
            searchBarHintText: "Sélectionez des défauts de saveur",
            selectedItems: viewModel.get("selectedFlavorDefects")
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.set("selectedFlavorDefects", null);
                viewModel.set("selectedFlavorDefects", data);
            }
        },
        true);
}

export function selectGrapes() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "grapes",
            groupingIcon: "group_work",
            multiple: true,
            searchBarHintText: "Sélectionez des cépages",
            selectedItems: viewModel.get("selectedGrapes")
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.set("selectedGrapes", null);
                viewModel.set("selectedGrapes", data);
            }
        },
        true);
}

export function setTastingDate() {
    page.showModal(
        Views.datePicker,
        {
            selectedDate: viewModel.get("tastingDate")
        },
        (data: any) => {
            if (data) {
                viewModel.set("tastingDate", null);
                viewModel.set("tastingDate", data);
            }
        });
}

export function selectFinalRating(args) {
    let finalRating = parseInt(args.object.className.match(/final-rating-(\d)/)[1], 10);
    viewModel.set("finalRating", finalRating);
}

export function goBack(args: any) {
    args = args || {};
    args.cancel = true;

    if (isBusyIndicator)
        return;

    dialogs.confirm({
        cancelButtonText: "Non",
        message: "Etes-vous sûr de vouloir quitter cette dégustation ?",
        okButtonText: "Oui",
        title: "Annuler"
    }).then(result => {
        if (result) {
            frameModule.goBack();
        }
    });
}

function isBusy(closeModal?: boolean) {
    if (closeModal) {
        if (busyModal) {
            isBusyIndicator = false;
            busyModal.closeModal();
            busyModal = null;
        }
    } else {
        isBusyIndicator = true;
        busyModal = page.showModal(Views.busyIndicator, null, () => { busyModal = null; viewModel.set("isBusy", true); }, false);
    }
}

function attachBackButtonConfirmation() {
    if (viewModel.get("isEdit"))
        return;

    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, goBack);
    }
}

function detachBackButtonConfirmation() {
    if (viewModel.get("isEdit"))
        return;

    // We only want to unregister the event on Android
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, goBack);
    }
};