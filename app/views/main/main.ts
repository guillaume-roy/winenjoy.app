import {EventData} from "data/observable";
import {Page} from "ui/page";
import {MainViewModel} from "../../view-models/main-view-model";
import frameModule = require("ui/frame");
import {Views} from "../../utils/views";

let viewModel: MainViewModel;
let topMost: any;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;
    viewModel = new MainViewModel();
    page.bindingContext = viewModel;
    topMost = frameModule.topmost();
}

export function fabTap(args) {
    topMost.navigate(Views.tasting);
}
