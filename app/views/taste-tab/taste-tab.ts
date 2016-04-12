import {EventData} from "data/observable";
import {Page} from "ui/page";
import {TasteTabViewModel} from "../../view-models/taste-tab-view-model";
import editTastingUtils = require("../../utils/edit-tasting");

let viewModel: TasteTabViewModel;
let page: Page;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    setTimeout(() => {
       viewModel = new TasteTabViewModel();
        page.bindingContext = viewModel;

        editTastingUtils.manageFabVisibility("scrollView", "fab", "fab-delete", page);
    });
}

export function navigatedFrom() {
    editTastingUtils.navigatedFrom(viewModel);
}

export function saveTasting() {
    editTastingUtils.saveTasting(viewModel);
}

export function deleteTasting() {
    editTastingUtils.deleteTasting(viewModel);
}
