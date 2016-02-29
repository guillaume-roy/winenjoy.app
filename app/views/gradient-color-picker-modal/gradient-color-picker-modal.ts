import pages = require("ui/page");
import observable = require("data/observable");
import {Page} from "ui/page";
import {GradientColorPickerModalViewModel} from "../../view-models/gradient-color-picker-modal-view-model";

let closeCallback: Function;
let viewModel: GradientColorPickerModalViewModel;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;

    viewModel = new GradientColorPickerModalViewModel(args.context);
    (<Page>args.object).bindingContext = viewModel;

    viewModel.addEventListener(observable.Observable.propertyChangeEvent,
    data => {
        closeCallback(viewModel.selectedColor);
    });
}
