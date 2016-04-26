import pages = require("ui/page");
import observable = require("data/observable");
import {Page} from "ui/page";
import {GradientColorPickerViewModel} from "../../view-models/gradient-color-picker-view-model";
import {AnalyticsService} from "../../services/analyticsService";

let closeCallback: Function;
let viewModel: GradientColorPickerViewModel;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;
    setTimeout(function() {
        viewModel = new GradientColorPickerViewModel(args.context);
        (<Page>args.object).bindingContext = viewModel;

        viewModel.addEventListener(
            observable.Observable.propertyChangeEvent,
            data => {
                closeCallback(viewModel.selectedColor);
            });

            new AnalyticsService().logView("gradient-color-picker");
    }, 0);
}
