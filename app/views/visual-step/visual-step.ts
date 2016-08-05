import {VisualStepViewModel} from "../../view-models/visual-step-view-model";
import {EventData} from "data/observable";
import {Page} from "ui/page";

let page: Page;
let viewModel: VisualStepViewModel;

export function navigatedTo(args: EventData) {
    viewModel = new VisualStepViewModel();
    page = <Page>args.object;
    page.bindingContext = viewModel;

    viewModel.init();
}