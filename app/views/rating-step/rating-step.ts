import {RatingStepViewModel} from "../../view-models/rating-step-view-model";
import {EventData} from "data/observable";
import {Page} from "ui/page";

let page: Page;
let viewModel: RatingStepViewModel;

export function navigatedTo(args: EventData) {
    viewModel = new RatingStepViewModel();
    page = <Page>args.object;
    page.bindingContext = viewModel;

    viewModel.init();
}