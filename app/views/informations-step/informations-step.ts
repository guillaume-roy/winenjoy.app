import {InformationsStepViewModel} from "../../view-models/informations-step-view-model";
import {EventData} from "data/observable";
import {Page} from "ui/page";

let page: Page;
let viewModel: InformationsStepViewModel;

export function navigatedTo(args: EventData) {
    viewModel = new InformationsStepViewModel();
    page = <Page>args.object;
    page.bindingContext = viewModel;

    viewModel.init();
}