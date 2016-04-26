import pages = require("ui/page");
import {Page} from "ui/page";
import {YearPickerViewModel} from "../../view-models/year-picker-view-model";
import {AnalyticsService} from "../../services/analyticsService";

let closeCallback: Function;
let viewModel: YearPickerViewModel;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;

    setTimeout(function() {
        viewModel = new YearPickerViewModel(args.context);
        let page = <Page>args.object;
        page.bindingContext = viewModel;

        new AnalyticsService().logView("year-picker");
    }, 0);
}

export function onValidate() {
    closeCallback(viewModel.selectedYear);
}
