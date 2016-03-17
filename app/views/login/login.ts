import {LoginViewModel} from "../../view-models/login-view-model";
import {EventData} from "data/observable";
import {Page} from "ui/page";
import editableTextBaseModule = require("ui/editable-text-base");

let viewModel: LoginViewModel;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;
    (<editableTextBaseModule.EditableTextBase>page.getViewById("login-field")).dismissSoftInput();
    viewModel = new LoginViewModel();
    page.bindingContext = viewModel;
}

export function onLogin() {
    viewModel.login();
}
