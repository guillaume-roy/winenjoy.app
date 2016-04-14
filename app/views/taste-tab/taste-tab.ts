import {EventData} from "data/observable";
import {Page} from "ui/page";
import {TasteTabViewModel} from "../../view-models/taste-tab-view-model";
import editTastingUtils = require("../../utils/edit-tasting");

let viewModel: TasteTabViewModel;
let page: Page;

export function loaded(args: EventData) {
    page = <Page>args.object;

    viewModel = new TasteTabViewModel();
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
