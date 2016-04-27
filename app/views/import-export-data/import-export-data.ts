import {EventData} from "data/observable";
import {Page} from "ui/page";
import {ImportExportDataViewModel} from "../../view-models/import-export-data-view-model";
import {AnalyticsService} from "../../services/analyticsService";
import frameModule = require("ui/frame");

let page: Page;
let viewModel: ImportExportDataViewModel;
let analyticsService: AnalyticsService;

export function navigatedTo(args: EventData) {
    analyticsService = new AnalyticsService();
    analyticsService.logView("import-export-data");

    page = <Page>args.object;

    viewModel = new ImportExportDataViewModel();
    page.bindingContext = viewModel;
}

export function onExportTastings() {
    viewModel.export().then(res => {
        analyticsService.logEvent("Action", "User Input", "onExportTastings");
    });
}

export function onImportTastings() {
    viewModel.import().then(res => {
        analyticsService.logEvent("Action", "User Input", "onImportTastings");
    });
}

export function goBack() {
    frameModule.goBack();
}
