import {FinalStepViewModel} from "../../view-models/final-step-view-model";
import {EventData} from "data/observable";
import {Page} from "ui/page";

let page: Page;
let viewModel: FinalStepViewModel;

export function navigatedTo(args: EventData) {
    viewModel = new FinalStepViewModel();
    page = <Page>args.object;
    page.bindingContext = viewModel;

    viewModel.init();
}