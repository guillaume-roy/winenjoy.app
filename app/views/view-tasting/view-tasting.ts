import {EventData} from "data/observable";
import {Page} from "ui/page";
import {ViewTastingViewModel} from "../../view-models/view-tasting-view-model";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");
import {Views} from "../../utils/views";

let viewModel: ViewTastingViewModel;
let page: Page;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    setTimeout(() => {
       viewModel = new ViewTastingViewModel(page.navigationContext);
        page.bindingContext = viewModel;
    });
}

export function onDeleteTasting() {
    dialogs.confirm({
        cancelButtonText: "Non",
        message: "Etes-vous sûr de vouloir supprimer cette dégustation ?",
        okButtonText: "Oui",
        title: "Supprimer"
    }).then(result => {
        if (result) {
            viewModel.deleteTasting();
            frameModule.topmost().navigate({
                animated: false,
                backstackVisible: false,
                moduleName: Views.main
            });
        }
    });
}

export function onEditTasting() {
    frameModule.topmost().navigate({
        animated: false,
        context: viewModel.wineTasting,
        moduleName: Views.editTasting,
        transition: null
    });
}

export function cancel() {
     frameModule.topmost().navigate({
        animated: false,
        backstackVisible: false,
        moduleName: Views.main
    });
}
