import {LoginViewModel} from "../../view-models/login-view-model";
import {EventData} from "data/observable";
import {Page} from "ui/page";
import dialogs = require("ui/dialogs");
import frameModule = require("ui/frame");
import {Views} from "../../utils/views";

let viewModel: LoginViewModel;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;
    viewModel = new LoginViewModel();
    page.bindingContext = viewModel;
}

export function onLogin() {
    viewModel.login()
    .then(data => {
        if (data) {
            frameModule.topmost().navigate({
                animated: false,
                backstackVisible: false,
                clearHistory: true,
                moduleName: Views.main,
                transition: null
            });
        } else {
            dialogs.alert({
                message: "Connexion impossible avec cet email.",
                okButtonText: "OK",
                title: "Erreur"
            });
        }
    },
    error => {
        dialogs.alert({
            message: "Une erreur lors de la connexion est survenue. Merci de re-tenter. Si le problème persiste, contactez-nous.",
            okButtonText: "OK",
            title: "Erreur"
        });
    });
}
