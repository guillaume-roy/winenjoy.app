import {VisualStepViewModel} from "../../view-models/visual-step-view-model";
import {NoseStepViewModel} from "../../view-models/nose-step-view-model";
import {TasteStepViewModel} from "../../view-models/taste-step-view-model";
import {InformationsStepViewModel} from "../../view-models/informations-step-view-model";
import {RatingStepViewModel} from "../../view-models/rating-step-view-model";
import {EventData} from "data/observable";
import {Page} from "ui/page";

let page: Page;
let visualStepViewModel: VisualStepViewModel;
let noseStepViewModel: NoseStepViewModel;
let tasteStepViewModel: TasteStepViewModel;
let informationsStepViewModel: InformationsStepViewModel;
let ratingStepViewModel: RatingStepViewModel;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    visualStepViewModel = new VisualStepViewModel();
    noseStepViewModel = new NoseStepViewModel();
    tasteStepViewModel = new TasteStepViewModel();
    informationsStepViewModel = new InformationsStepViewModel();
    ratingStepViewModel = new RatingStepViewModel();
    
    page.getViewById("visualStep").bindingContext = visualStepViewModel;
    page.getViewById("noseStep").bindingContext = noseStepViewModel;
    page.getViewById("tasteStep").bindingContext = tasteStepViewModel;
    page.getViewById("informationsStep").bindingContext = informationsStepViewModel;
    page.getViewById("ratingStep").bindingContext = ratingStepViewModel;

    visualStepViewModel.init();
    noseStepViewModel.init();
    tasteStepViewModel.init();
    informationsStepViewModel.init();
    ratingStepViewModel.init();
}