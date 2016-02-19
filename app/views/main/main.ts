import {EventData} from "data/observable";
import {Page} from "ui/page";
import {GestureEventData} from "ui/gestures";
import {MainViewModel} from "../../view-models/main-view-model";

let viewModel: MainViewModel;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;
    viewModel = new MainViewModel();
    page.bindingContext = viewModel;
}

export function onClick(args: GestureEventData) {
    viewModel.click();
}
