import {ChangePasswordViewModel} from "../../view-models/change-password-view-model";
import {EventData} from "data/observable";
import pages = require("ui/page");
import {Page} from "ui/page";
import dialogs = require("ui/dialogs");
import frameModule = require("ui/frame");
import {Views} from "../../utils/views";
import {AnalyticsService} from "../../services/analyticsService";

let viewModel: ChangePasswordViewModel;
let analyticsService: AnalyticsService;
let closeCallback: Function;

export function navigatedTo(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;

    let page = <Page>args.object;
    viewModel = new ChangePasswordViewModel();
    page.bindingContext = viewModel;

    analyticsService = new AnalyticsService();
    analyticsService.logView("change-password");
}

export function onChangePassword() {
    if (viewModel.canSubmit) {
        viewModel.changePassword().then(res => {
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
