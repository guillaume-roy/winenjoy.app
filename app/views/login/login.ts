import {LoginViewModel} from "../../view-models/login-view-model";
import {EventData} from "data/observable";
import {Page} from "ui/page";
import dialogs = require("ui/dialogs");
import frameModule = require("ui/frame");
import {Views} from "../../utils/views";
import {AnalyticsService} from "../../services/analyticsService";

let viewModel: LoginViewModel;
let analyticsService: AnalyticsService;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;
    viewModel = new LoginViewModel();
    page.bindingContext = viewModel;

    analyticsService = new AnalyticsService();
    analyticsService.logView("login");

    let t = page.getViewById("email");
    t.android.setHintTextColor(android.graphics.Color.WHITE);

    let p = page.getViewById("password");
    p.android.setHintTextColor(android.graphics.Color.WHITE);
}

export function onLogin() {
    if (!viewModel.isBusy && viewModel.canSubmit) {
        viewModel.login().then(res => {
            analyticsService.logEvent("Action", "User Input", "onLogin");
            analyticsService.dispatch();
            frameModule.topmost().navigate({
                animated: false,
                backstackVisible: true,
                moduleName: Views.main
            });
        }).catch(error => {
            analyticsService.logException(error, false);
            analyticsService.dispatch();
            dialogs.alert({
                message: "Erreur lors de la connexion.",
                okButtonText: "OK",
                title: "Erreur"
            });
        });
    }
}

export function onSignup() {
    if (!viewModel.isBusy && viewModel.canSubmit) {
        viewModel.signup().then(res => {
            analyticsService.logEvent("Action", "User Input", "onSignup");
            analyticsService.dispatch();
            // frameModule.topmost().navigate({
            //     animated: false,
            //     backstackVisible: true,
            //     moduleName: Views.main
            // });
        }).catch(error => {
            analyticsService.logException(error, false);
            analyticsService.dispatch();
            dialogs.alert({
                message: "Erreur lors de la création du compte.",
                okButtonText: "OK",
                title: "Erreur"
            });
        });
    }
}

export function onForgotPassword() {
    if (!viewModel.isBusy && viewModel.canForgotPassword) {
        viewModel.forgotPassword().then(res => {
            analyticsService.logEvent("Action", "User Input", "onForgotPassword");
            analyticsService.dispatch();
            dialogs.alert({
                message: "Une procédure de réinitialisation de votre mot de passe vient d'être envoyé par email.",
                okButtonText: "OK",
                title: "Mot de passe oublié"
            });
        }).catch(error => {
            analyticsService.logException(error, false);
            analyticsService.dispatch();
            dialogs.alert({
                message: "Erreur lors de la réinitialisation du mot de passe.",
                okButtonText: "OK",
                title: "Erreur"
            });
        });
    }
}
