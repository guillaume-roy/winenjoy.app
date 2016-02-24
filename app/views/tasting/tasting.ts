import {EventData} from "data/observable";
import {Page} from "ui/page";
import {TastingViewModel} from "../../view-models/tasting-view-model";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");

let viewModel: TastingViewModel;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;
    viewModel = new TastingViewModel();
    page.bindingContext = viewModel;
}

export function onSaveTasting() {
    console.log("onSave");
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
