import {NoseStepViewModel} from "../../view-models/nose-step-view-model";
import {EventData} from "data/observable";
import {Page} from "ui/page";

let page: Page;
let viewModel: NoseStepViewModel;

export function navigatedTo(args: EventData) {
    viewModel = new NoseStepViewModel();
    page = <Page>args.object;
    page.bindingContext = viewModel;

    viewModel.init();
}