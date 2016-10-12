import pages = require("ui/page");
import {Page} from "ui/page";
import {GroupingListPickerViewModel} from "../../view-models/grouping-list-picker-view-model";
import {EventData} from "data/observable";
import {SearchBar} from "ui/search-bar";

let closeCallback: Function;
let viewModel: GroupingListPickerViewModel;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;

    viewModel = new GroupingListPickerViewModel(args.context);
    let page = <Page>args.object;
    page.bindingContext = viewModel;
}

export function loaded() {
    setTimeout(() => {
        viewModel.loadItems();
    }, 0);
}

export function onToggleGroup(args: EventData) {
    viewModel.toggleGroup((<any>args.object).bindingContext);
}

export function onSelectItem(args) {
    viewModel.selectItem(args.view.bindingContext);

    if (!viewModel.get("multiple")) {
        closeCallback(viewModel.selectedItem);
    }
}

export function onValidate() {
    closeCallback(viewModel.selectedItems);
}

export function useNewElement() {
    if (!viewModel.get("multiple")) {
        //viewModel.useNewElement();
        closeCallback(viewModel.selectedItem);
    }
}

