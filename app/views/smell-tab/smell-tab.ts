import _ = require("lodash");
import {EventData} from "data/observable";
import {Page} from "ui/page";
import {SmellTabViewModel} from "../../view-models/smell-tab-view-model";
import {Views} from "../../utils/views";
import editTastingUtils = require("../../utils/edit-tasting");

let viewModel: SmellTabViewModel;
let page: Page;

export function loaded(args: EventData) {
    page = <Page>args.object;

    viewModel = new SmellTabViewModel();
    page.bindingContext = viewModel;
}

export function navigatedTo(args: EventData) {
    setTimeout(() => {
        editTastingUtils.attachBackButtonConfirmation(viewModel);
        editTastingUtils.manageFabVisibility("scrollView", "fab", "fab-delete", page);
    });
}

export function navigatedFrom() {
    editTastingUtils.detachBackButtonConfirmation(viewModel);
    editTastingUtils.navigatedFrom(viewModel);
}

export function saveTasting() {
    editTastingUtils.saveTasting(viewModel);
}

export function deleteTasting() {
    editTastingUtils.deleteTasting(viewModel);
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
