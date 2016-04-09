import pages = require("ui/page");
import {Page} from "ui/page";
import {GroupingListPickerViewModel} from "../../view-models/grouping-list-picker-view-model";
import {EventData} from "data/observable";

let closeCallback: Function;
let viewModel: GroupingListPickerViewModel;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;

    setTimeout(function() {
        viewModel = new GroupingListPickerViewModel(args.context);
        let page = <Page>args.object;
        page.bindingContext = viewModel;
    }, 0);
}

export function onToggleGroup(args: EventData) {
    viewModel.toggleGroup(args.object.bindingContext);
}

export function onSelectItem(args) {
    viewModel.selectItem(args.view.bindingContext);

    if (!viewModel.multiple) {
        closeCallback(viewModel.selectedItem);
    }
}

export function onValidate() {
    closeCallback(viewModel.selectedItems);
}
