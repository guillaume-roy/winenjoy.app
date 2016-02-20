import {EventData} from "data/observable";
import {Page} from "ui/page";
import {GestureEventData} from "ui/gestures";
import {TastingViewModel} from "../../view-models/tasting-view-model";

let viewModel: TastingViewModel;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;
    viewModel = new TastingViewModel();
    page.bindingContext = viewModel;
}
