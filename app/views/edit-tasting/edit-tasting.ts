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
import _ = require("lodash");
import {View} from "ui/core/view";
import {AnalyticsService} from "../../services/analyticsService";
import camera = require("camera");
import imageSource = require("image-source");

let page: Page;
let viewModel: EditTastingViewModel;
let fabButton: View;
let fabDeleteButton: View;
let fabButtonDelay = 0;
let tabView: tabViewModule.TabView;
let analyticsService: AnalyticsService;

export function navigatedTo(args: EventData) {
    console.log(new Date().toISOString(), "navigated to edit-tasting");

    analyticsService = new AnalyticsService();
    analyticsService.logView("edit-tasting");
    analyticsService.stopTimer("Navigation from main to edit-tasting");

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
    tabView.off(tabViewModule.TabView.selectedIndexChangedEvent, attachToScroll);
    attachToScroll({
        eventName: tabViewModule.TabView.selectedIndexChangedEvent,
        newIndex: -1,
        object: null,
        oldIndex: tabView.selectedIndex
    });
}

export function onSelectFinalRating(args) {
    let finalRating = args.object.className.match(/final-rating-(\d)/)[1];
    viewModel.setFinalRating(parseInt(finalRating, 10));
    analyticsService.logEvent("Navigation", "User Input", "onSelectFinalRating");
}

export function onSelectColor() {
    page.showModal(
        Views.gradientColorPicker,
        viewModel.wineTasting,
        function(selectedColor) {
            viewModel.wineTasting.color = selectedColor;
            viewModel.notifyPropertyChange("wineTasting", viewModel.wineTasting);
            analyticsService.logEvent("Navigation", "User Input", "onSelectedColor");
        },
        false);
    analyticsService.logEvent("Navigation", "User Input", "onSelectColor");
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
                analyticsService.logEvent("Navigation", "User Input", "onAddedAromas");
            }
        },
        true);
    analyticsService.logEvent("Navigation", "User Input", "onAddAromas");
}

export function onAddDefects() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "aromas",
            multiple: true,
            searchBarHintText: "Rechercher un défaut",
            selectedItems: viewModel.wineTasting.defects
        },
        function(items) {
            if (_.isArray(items)) {
                viewModel.setDefects(items);
                analyticsService.logEvent("Navigation", "User Input", "onAddedDefects");
            }
        },
        true);
    analyticsService.logEvent("Navigation", "User Input", "onAddDefects");
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
                analyticsService.logEvent("Navigation", "User Input", "onSelectedCountry");
            }
        },
        true);
    analyticsService.logEvent("Navigation", "User Input", "onSelectCountry");
}

export function onDeleteCountry() {
    viewModel.setCountry(null);
}

export function onSelectRegion() {
   page.showModal(
        Views.listPicker,
        {
            criterias: "regions",
            parentCode: (viewModel.wineTasting.country || {}).code,
            searchBarHintText: "Rechercher une région",
            selectedItems: viewModel.wineTasting.region
        },
        function(selectedRegion) {
            viewModel.setRegion(selectedRegion);
            analyticsService.logEvent("Navigation", "User Input", "onSelectedRegion");
        },
        true);
    analyticsService.logEvent("Navigation", "User Input", "onSelectRegion");
}

export function onDeleteRegion() {
    viewModel.setRegion(null);
}

export function onSelectAoc() {
   page.showModal(
        Views.listPicker,
        {
            criterias: "aoc",
            parentCode: (viewModel.wineTasting.region || {}).code,
            searchBarHintText: "Rechercher un AOC",
            selectedItems: viewModel.wineTasting.aoc
        },
        function(selectedAoc) {
            viewModel.setAoc(selectedAoc);
            analyticsService.logEvent("Navigation", "User Input", "onSelectedAoc");
        },
        true);
    analyticsService.logEvent("Navigation", "User Input", "onSelectAoc");
}

export function onDeleteAoc() {
    viewModel.setAoc(null);
}

export function onSelectYear() {
    page.showModal(
        Views.yearPicker,
        viewModel.wineTasting.year,
        data => {
            if (_.isNumber(data)) {
                viewModel.setYear(data);
                analyticsService.logEvent("Navigation", "User Input", "onSelectedYear");
            }
        },
        false);
    analyticsService.logEvent("Navigation", "User Input", "onSelectYear");
}

export function onDeleteYear() {
    viewModel.setYear(null);
}

export function onSelectGrapes() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "grapes",
            multiple: true,
            searchBarHintText: "Rechercher un cépage",
            selectedItems: viewModel.wineTasting.grapes
        },
        function(selectedGrapes) {
            if (_.isArray(selectedGrapes)) {
                viewModel.setGrapes(selectedGrapes);
                analyticsService.logEvent("Navigation", "User Input", "onSelectedGrapes");
            }
        },
        true);
    analyticsService.logEvent("Navigation", "User Input", "onSelectGrapes");
}

export function onTakePicture() {
    camera.takePicture({
        height: 320,
        keepAspectRatio: true,
        width: 320
    }).then((img: imageSource.ImageSource) => {
        viewModel.setPicture(img.toBase64String("png", 70));
    });
}

export function onDeletePicture() {
    viewModel.setPicture(null);
}

export function saveTasting() {
    analyticsService.startTimer("Saving tasting", "Action", "saveTasting");
    setTimeout(() => {
        viewModel.saveTasting().then(result => {
            analyticsService.stopTimer("Saving tasting");
            analyticsService.logEvent("Navigation", "User Input", "saveTasting");
            analyticsService.dispatch();
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
            analyticsService.startTimer("Delete tasting", "Action", "deleteTasting");
            analyticsService.dispatch();
            setTimeout(() => {
                viewModel.deleteTasting().then(r => {
                    analyticsService.stopTimer("Delete tasting");
                    analyticsService.logEvent("Navigation", "User Input", "deleteTasting");
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
            analyticsService.dispatch();
            frameModule.topmost().navigate({
                animated: false,
                moduleName: Views.main
            });
        }
    });
}

function animateFabButtons(scrollEvent: scrollViewModule.ScrollEventData) {
    if (fabDeleteButton) {
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
}

function attachToScroll(args: tabViewModule.SelectedIndexChangedEventData) {
    let scrollViewIds = [ "scroll-0", "scroll-1", "scroll-2", "scroll-3", "scroll-4" ];

    if (args.newIndex >= 0) {
        let scrollViewToAttach = page.getViewById(scrollViewIds[args.newIndex]);
        if (scrollViewToAttach) {
            scrollViewToAttach.on(scrollViewModule.ScrollView.scrollEvent, animateFabButtons);
        }
    }

    if (args.oldIndex >= 0) {
        let scrollViewToDetach = page.getViewById(scrollViewIds[args.oldIndex]);
        if (scrollViewToDetach) {
            scrollViewToDetach.off(scrollViewModule.ScrollView.scrollEvent, animateFabButtons);
        }
    }
}

function manageFabVisibility() {
    fabButton = page.getViewById("fab");
    fabDeleteButton = page.getViewById("fab-delete");
    fabButtonDelay = fabDeleteButton ? 100 : 0;

    tabView = <tabViewModule.TabView>page.getViewById("tab-view");
    if (tabView) {
        tabView.on(tabViewModule.TabView.selectedIndexChangedEvent, attachToScroll);
    }

    attachToScroll({ eventName: tabViewModule.TabView.selectedIndexChangedEvent, newIndex: 0, object: null, oldIndex: -1 });
}
