import {EventData} from "data/observable";
import {Page} from "ui/page";
import {InformationsTabViewModel} from "../../view-models/informations-tab-view-model";
import scrollViewModule = require("ui/scroll-view");
import {Views} from "../../utils/views";
import _ = require("lodash");
import frameModule = require("ui/frame");

let viewModel: InformationsTabViewModel;
let page: Page;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    setTimeout(() => {
       viewModel = new InformationsTabViewModel();
        page.bindingContext = viewModel;

        manageFabVisibility();
    });
}

export function navigatedFrom() {
    viewModel.storeTasting();
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

export function onSelectCountry() {
    page.showModal(
        Views.groupingListPicker,
        {
            criterias: "geo",
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
