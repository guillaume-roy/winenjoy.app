import {EventData} from "data/observable";
import dialogs = require("ui/dialogs");
import {Page} from "ui/page";
import {EditTastingViewModel} from "../../view-models/edit-tasting-view-model";
import geolocation = require("nativescript-geolocation");
import frameModule = require("ui/frame");
import {Views} from "../../utils/views";
import scrollViewModule = require("ui/scroll-view");
import application = require("application");
import tabViewModule = require("ui/tab-view");

let page: Page;
let viewModel: EditTastingViewModel;

export function navigatedTo(args: EventData) {
    console.log(new Date().toISOString(), "navigated to edit-tasting");

    page = <Page>args.object;

    viewModel = new EditTastingViewModel(page.navigationContext);
    page.bindingContext = viewModel;

    console.log(new Date().toISOString(), "view-model bound");

    setTimeout(() => {
        if (geolocation.isEnabled() && !viewModel.isEditMode) {
            geolocation.getCurrentLocation({timeout: 5000}).then(loc => {
                viewModel.wineTasting.latitude = loc.latitude;
                viewModel.wineTasting.longitude = loc.longitude;
                viewModel.wineTasting.altitude = loc.altitude;
            });
        }
    });

    attachBackButtonConfirmation();
    manageFabVisibility();
}

export function navigatedFrom() {
    detachBackButtonConfirmation();
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
            if (_.isArray(data)) {
                viewModel.setAromas(data);
            }
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
            if (_.isArray(items)) {
                viewModel.setDefects(items);
            }
        },
        true);
}

export function onSelectCountry() {
    page.showModal(
        Views.groupingListPicker,
        {
            criterias: "countries",
            groupingIcon: "public",
            multiple: false,
            searchBarHintText: "Sélectionnez un pays"
        },
        data => {
            if (!_.isEmpty(data)) {
                viewModel.setCountry(data);
            }
        },
        true);
}

export function onDeleteCountry() {
    viewModel.setCountry(null);
}

export function onSelectRegion() {
   page.showModal(
        Views.listPicker,
        {
            criterias: "regions",
            searchBarHintText: "Rechercher une région",
            selectedItems: viewModel.wineTasting.region
        },
        function(selectedRegion) {
            viewModel.setRegion(selectedRegion);
        },
        true);
}

export function onDeleteRegion() {
    viewModel.setCountry(null);
}

export function onSelectAoc() {
   page.showModal(
        Views.listPicker,
        {
            criterias: "aoc",
            searchBarHintText: "Rechercher un AOC",
            selectedItems: viewModel.wineTasting.aoc
        },
        function(selectedAoc) {
            viewModel.setAoc(selectedAoc);
        },
        true);
}

export function onDeleteAoc() {
    viewModel.setCountry(null);
}

export function onSelectYear() {
    page.showModal(
        Views.yearPicker,
        viewModel.wineTasting.year,
        data => {
            if (_.isNumber(data)) {
                viewModel.setYear(data);
            }
        },
        false);
}

export function onDeleteYear() {
    viewModel.setYear(null);
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
            if (_.isArray(selectedGrapes)) {
                viewModel.setGrapes(selectedGrapes);
            }
        },
        true);
}

export function saveTasting() {
    setTimeout(() => {
        viewModel.saveTasting().then(result => {
            frameModule.topmost().navigate({
                animated: false,
                moduleName: Views.main
            });
        });
    }, 0);
}

export function deleteTasting() {
    dialogs.confirm({
        cancelButtonText: "Non",
        message: "Etes-vous sûr de vouloir supprimer cette dégustation ?",
        okButtonText: "Oui",
        title: "Suppression"
    }).then(result => {
        if (result) {
            setTimeout(() => {
                viewModel.deleteTasting().then(r => {
                    frameModule.topmost().navigate({
                        animated: false,
                        moduleName: Views.main
                    });
                });
            }, 0);
        }
    });
}

function attachBackButtonConfirmation() {
    if (viewModel.isEditMode) {
        return;
    }

    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
}

function detachBackButtonConfirmation() {
    if (viewModel.isEditMode) {
        return;
    }

    // We only want to un-register the event on Android
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
};

function backEvent(args: any) {
    args.cancel = true;

    dialogs.confirm({
        cancelButtonText: "Non",
        message: "Etes-vous sûr de vouloir annuler cette dégustation ?",
        okButtonText: "Oui",
        title: "Annuler"
    }).then(result => {
        if (result) {
            frameModule.topmost().navigate({
                animated: false,
                moduleName: Views.main
            });
        }
    });
}

function manageFabVisibility() {
    let tabView = page.getViewById("tab-view");

    if (tabView) {
        tabView.on(tabViewModule.TabView.selectedIndexChangedEvent, (data: tabViewModule.SelectedIndexChangedEventData) => {
            let fabButton = page.getViewById("fab");
            let fabDeleteButton = page.getViewById("fab-delete");
            let fabButtonDelay = 0;

            if (fabDeleteButton) {
                fabButtonDelay = 100;

                fabDeleteButton.animate({
                    duration: 300,
                    translate: {
                        x: 0,
                        y: 0
                    }
                });
            }

            if (fabButton) {
                fabButton.animate({
                    delay: fabButtonDelay,
                    duration: 300,
                    translate: {
                        x: 0,
                        y: 0
                    }
                });
            }
        });
    }

    let scrollViewIds = [ "scroll-0", "scroll-1", "scroll-2", "scroll-3", "scroll-4" ];

    for (let i = 0; i < scrollViewIds.length; i++) {

        let scrollView = page.getViewById(scrollViewIds[i]);

        if (scrollView) {
            scrollView.on("scroll", (scrollEvent: scrollViewModule.ScrollEventData) => {
                let fabButton = page.getViewById("fab");
                let fabDeleteButton = page.getViewById("fab-delete");
                let fabButtonDelay = 0;

                if (fabDeleteButton) {
                    fabButtonDelay = 100;

                    if (scrollEvent.scrollY !== 0) {
                        fabDeleteButton.animate({
                            duration: 300,
                            translate: {
                                x: 200,
                                y: 0
                            }
                        });
                    } else {
                        fabDeleteButton.animate({
                            duration: 300,
                            translate: {
                                x: 0,
                                y: 0
                            }
                        });
                    }
                }

                if (fabButton) {
                    if (scrollEvent.scrollY !== 0) {
                        fabButton.animate({
                            delay: fabButtonDelay,
                            duration: 300,
                            translate: {
                                x: 200,
                                y: 0
                            }
                        });
                    } else {
                        fabButton.animate({
                            delay: fabButtonDelay,
                            duration: 300,
                            translate: {
                                x: 0,
                                y: 0
                            }
                        });
                    }
                }
            });
        }
    }
}