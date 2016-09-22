import {EventData} from "data/observable";
import {Page} from "ui/page";
import dialogs = require("ui/dialogs");
import camera = require("camera");
import profiler = require("../../utils/profiling");
import {EditTastingViewModel} from "../../view-models/edit-tasting-view-model";
import {Views} from "../../utils/views";
import frameModule = require("ui/frame");
import _ = require("lodash");

let page: Page;
let locationAutoComplete;
let viewModel: EditTastingViewModel;
let busyModal: Page;

export function navigatedTo(args: EventData) {
    profiler.start("loading edit-tasting");
    page = <Page>args.object;
    locationAutoComplete = page.getViewById("locationAutoComplete");
    viewModel = new EditTastingViewModel();

    page.bindingContext = viewModel;

    if (locationAutoComplete.android) {
        locationAutoComplete.android.setHint("Pays, Région, AOC");
        locationAutoComplete.android.setHintTextColor(android.graphics.Color.parseColor("#727272"));
        locationAutoComplete.android.setTextSize(16);
    }

    setTimeout(() => {
        profiler.start("init edit-tasting-view-model");
        viewModel.init();
        profiler.stop("init edit-tasting-view-model");

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
    });
}

export function loaded() {
    profiler.stop("loading edit-tasting");
}

export function managePicture() {
    if (viewModel.get("containsPicture")) {
        var args = {
            tastingId: null,
            img: null
        };

        if (viewModel.get("isEdit")) {
            args.tastingId = viewModel.get("editWineTasting").id;
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
        });
    }
}

export function saveTasting() {
    isBusy();

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

export function deleteTasting() {
    dialogs.confirm({
        cancelButtonText: "Annuler",
        message: "Etes-vous spur de vouloir supprimer cette dégustation ?",
        okButtonText: "OK",
        title: "Suppression"
    }).then(confirm => {
        if (confirm) {
            isBusy();
            setTimeout(() => {
                viewModel.deleteTasting()
                    .then(() => {
                        isBusy(true);
                        frameModule.topmost()
                            .navigate({
                                animated: false,
                                backstackVisible: false,
                                moduleName: Views.main
                            });
                    });
            }, 0);
        }
    }).catch(error => {
        isBusy(true);
        console.log("deleteTasting ERROR");
        console.log(error.message);
        console.log(error.error);
    });;
}

function isBusy(closeModal?: boolean) {
    if (closeModal) {
        if (busyModal) {
            busyModal.closeModal();
            busyModal = null;
        }
    } else {
        busyModal = page.showModal(Views.busyIndicator, null, () => { busyModal = null; }, false);
    }
}