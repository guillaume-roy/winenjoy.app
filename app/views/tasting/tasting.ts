import {EventData} from "data/observable";
import {Page} from "ui/page";
import {GestureEventData} from "ui/gestures";
import {TastingViewModel} from "../../view-models/tasting-view-model";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");

let viewModel: TastingViewModel;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;
    viewModel = new TastingViewModel();
    page.bindingContext = viewModel;
}

export function cancel() {
    dialogs.confirm({
        title: "Annuler",
        message: "Etes-vous sûr de vouloir annuler cette dégustation ?",
        okButtonText: "Oui",
        cancelButtonText: "Non"
    }).then(result => {
        if(result)
            frameModule.topmost().goBack();
    });
}