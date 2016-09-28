import {EventData} from "data/observable";
import {Page} from "ui/page";
import {ImportExportDataViewModel} from "../../view-models/import-export-data-view-model";
import frameModule = require("ui/frame");

let page: Page;
let viewModel: ImportExportDataViewModel;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    viewModel = new ImportExportDataViewModel();
    page.bindingContext = viewModel;
}

export function onExportTastings() {
    viewModel.export();
}

export function onImportTastings() {
    viewModel.import();
}

export function goBack() {
    frameModule.goBack();
}
