import {EventData} from "data/observable";
import {Page} from "ui/page";
import {GestureEventData} from "ui/gestures";
import {MainViewModel} from "../../view-models/main-view-model";
import frameModule = require("ui/frame");
import {Views} from "../../utils/views";

let viewModel: MainViewModel;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;
    viewModel = new MainViewModel();
    page.bindingContext = viewModel;
}

export function onClick(args: GestureEventData) {
    viewModel.click();
}

export function fabTap(args) {
    let topmost = frameModule.topmost();
    topmost.navigate(Views.tasting);
}