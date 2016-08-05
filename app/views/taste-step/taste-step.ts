import {TasteStepViewModel} from "../../view-models/taste-step-view-model";
import {EventData} from "data/observable";
import {Page} from "ui/page";

let page: Page;
let viewModel: TasteStepViewModel;

export function navigatedTo(args: EventData) {
    viewModel = new TasteStepViewModel();
    page = <Page>args.object;
    page.bindingContext = viewModel;

    viewModel.init();
}