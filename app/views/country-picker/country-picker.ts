import pages = require("ui/page");
import {Page} from "ui/page";
import {CountryPickerViewModel} from "../../view-models/country-picker-view-model";
import {EventData} from "data/observable";

let closeCallback: Function;
let viewModel: CountryPickerViewModel;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;

    setTimeout(function() {
        viewModel = new CountryPickerViewModel(args.context);
        let page = <Page>args.object;
        page.bindingContext = viewModel;
    }, 0);
}

export function onToggleArea(args: EventData) {
    viewModel.toggleArea(args.object.bindingContext);
}

export function onSelectCountry(args) {
    viewModel.selectCountry(args.view.bindingContext);
    closeCallback(viewModel.selectedItem);
}
