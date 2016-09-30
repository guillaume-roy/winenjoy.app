import {EventData} from "data/observable";
import {Page} from "ui/page";
import {MainViewModel} from "../../view-models/main-view-model";
import frameModule = require("ui/frame");
import {View} from "ui/core/view";
import {Views} from "../../utils/views";
import listViewModule = require("ui/list-view");
import dialogs = require("ui/dialogs");
import application = require("application");
import {Config} from "../../utils/config";

let viewModel: MainViewModel;
let page: Page;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    viewModel = new MainViewModel();
    page.bindingContext = viewModel;
    
    setTimeout(() => {
        viewModel.init()
            .catch(error => {
                console.dump(error);
                dialogs.alert({
                    message: "Erreur lors du chargement des dégustations.",
                    title: "Erreur",
                    okButtonText: "OK"
                });
            });
    }, 0);

    setTimeout(() => {
        viewModel.needToUpdateApp().then(needToUpdate => {
            if (needToUpdate) {
                dialogs.alert({
                    message: "Une nouvelle mise à jour est disponible pour l'application.",
                    title: "Mise à jour",
                    okButtonText: "Mettre à jour"
                }).then(() => {
                    var config = new Config();
                    var intent = new android.content.Intent(
                        android.content.Intent.ACTION_VIEW,
                        android.net.Uri.parse(config.PlayStoreAppLink));
                    intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                    application.android.context.startActivity(intent);
                    application.android.foregroundActivity.finishAffinity();
                    java.lang.System.exit(0);
                });
            }
        });
    }, 0);
}

export function onCreateNewTasting(args: EventData) {
    setTimeout(() => {
        frameModule.topmost()
            .navigate({
                animated: false,
                backstackVisible: false,
                moduleName: Views.editTastingNormal
            });
    }, 0);
}

export function onCreateFirstTasting() {
    setTimeout(() => {
        frameModule.topmost().navigate({
            animated: false,
            backstackVisible: false,
            moduleName: Views.editTastingNormal
        });
    }, 0);
}

export function onViewTasting(args: listViewModule.ItemEventData) {
    setTimeout(() => {
        frameModule.topmost().navigate({
            animated: false,
            backstackVisible: true,
            context: viewModel.get("tastings")[args.index],
            moduleName: Views.editTastingFull
        });
    }, 0);
}

export function refreshTastings() {
    setTimeout(() => {
        viewModel.refreshTastings()
            .catch(error => {
                console.dump(error);
                dialogs.alert({
                    message: "Erreur lors du chargement des dégustations.",
                    title: "Erreur",
                    okButtonText: "OK"
                });
            });
    }, 0);
}
