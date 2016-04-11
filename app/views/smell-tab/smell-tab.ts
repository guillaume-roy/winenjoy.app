import _ = require("lodash");
import {EventData} from "data/observable";
import {Page} from "ui/page";
import {SmellTabViewModel} from "../../view-models/smell-tab-view-model";
import {Views} from "../../utils/views";
import scrollViewModule = require("ui/scroll-view");

let viewModel: SmellTabViewModel;
let page: Page;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    setTimeout(() => {
       viewModel = new SmellTabViewModel();
        page.bindingContext = viewModel;

        manageFabVisibility();
    });
}

export function navigatedFrom() {
    viewModel.storeTasting();
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
