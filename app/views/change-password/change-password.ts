import {ChangePasswordViewModel} from "../../view-models/change-password-view-model";
import pages = require("ui/page");
import {Page} from "ui/page";
import dialogs = require("ui/dialogs");
import {AnalyticsService} from "../../services/analyticsService";

let viewModel: ChangePasswordViewModel;
let analyticsService: AnalyticsService;
let closeCallback: Function;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;

    viewModel = new ChangePasswordViewModel();
    let page = <Page>args.object;
    page.bindingContext = viewModel;

    analyticsService = new AnalyticsService();
    analyticsService.logView("change-password");
}

export function onChangePassword() {
    if (viewModel.canSubmit) {
        viewModel.changePassword().then(res => {
            analyticsService.logEvent("Navigation", "User Input", "onChangedPassword");
            closeCallback(true);
        }).catch(error => {
            analyticsService.logException(error, false);
            analyticsService.dispatch();
            dialogs.alert({
                message: error,
                okButtonText: "OK",
                title: "Erreur"
            });
        });
    }
}
