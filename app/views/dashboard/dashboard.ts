import {EventData} from "data/observable";
import {Page} from "ui/page";
import {DashboardViewModel} from "../../view-models/dashboard-view-model";
import frameModule = require("ui/frame");

let viewModel: DashboardViewModel;
let page: Page;

export function loaded(args: EventData) {
    page = <Page>args.object;
    viewModel = new DashboardViewModel();
    page.bindingContext = viewModel;

    setTimeout(() => {
        viewModel.load();
    }, 0);
}

export function goBack() {
    frameModule.goBack();
}