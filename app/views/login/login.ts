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
    
    let t = page.getViewById("email");
    t.android.setHintTextColor(android.graphics.Color.WHITE);

    let p = page.getViewById("password");
    p.android.setHintTextColor(android.graphics.Color.WHITE);
}

export function onLogin() {
    if (!viewModel.isBusy && viewModel.canSubmit) {
        setTimeout(() => {
            viewModel.login().then(res => {
                frameModule.topmost().navigate({
                    animated: false,
                    backstackVisible: true,
                    moduleName: Views.main
                });
            }).catch(error => {
                console.dump(error);
                dialogs.alert({
                    message: "Erreur lors de la connexion.",
                    okButtonText: "OK",
                    title: "Erreur"
                });
            });
        }, 0);
    }
}

export function onSignup() {
    if (!viewModel.isBusy && viewModel.canSubmit) {
        setTimeout(() => {
            viewModel.signup().then(res => {
                frameModule.topmost().navigate({
                    animated: false,
                    backstackVisible: true,
                    moduleName: Views.main
                });
            }).catch(error => {
                console.dump(error);
                dialogs.alert({
                    message: "Erreur lors de la création du compte.",
                    okButtonText: "OK",
                    title: "Erreur"
                });
            });
        }, 0);
    }
}

export function onForgotPassword() {
    if (!viewModel.isBusy && viewModel.canForgotPassword) {
        setTimeout(() => {
            viewModel.forgotPassword()
                .then(res => {
                    dialogs.alert({
                        message:
                        "Une procédure de réinitialisation de votre mot de passe vient d'être envoyé par email.",
                        okButtonText: "OK",
                        title: "Mot de passe oublié"
                    });
                })
                .catch(error => {
                    console.dump(error);
                    dialogs.alert({
                        message: "Erreur lors de la réinitialisation du mot de passe.",
                        okButtonText: "OK",
                        title: "Erreur"
                    });
                });
        }, 0);
    }
}
