import {EventData} from "data/observable";
import {Page} from "ui/page";
import {TastingViewModel} from "../../view-models/tasting-view-model";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");
import {Slider} from "ui/slider";

let viewModel: TastingViewModel;

export function loaded(args: EventData) {
    let page = <Page>args.object;
    let alcoholSlider = <Slider>page.getViewById("alcohol-slider");
}

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;
    viewModel = new TastingViewModel();
    page.bindingContext = viewModel;
}

export function cancel() {
    dialogs.confirm({
        cancelButtonText: "Non",
        message: "Etes-vous sûr de vouloir annuler cette dégustation ?",
        okButtonText: "Oui",
        title: "Annuler"
    }).then(result => {
        if (result) {
            frameModule.topmost().goBack();
        }
    });
}
