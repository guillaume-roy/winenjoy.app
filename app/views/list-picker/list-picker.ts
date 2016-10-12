import pages = require("ui/page");
import {Page} from "ui/page";
import {ListPickerViewModel} from "../../view-models/list-picker-view-model";
import {SearchBar} from "ui/search-bar";
import listViewModule = require("ui/list-view");

let closeCallback: Function;
let viewModel: ListPickerViewModel;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;

    viewModel = new ListPickerViewModel(args.context);
    let page = <Page>args.object;
    page.bindingContext = viewModel;

    let searchBar = <SearchBar>page.getViewById("searchBar");
    searchBar.on(SearchBar.propertyChangeEvent, searchBarArgs => {
        viewModel.searchingText = searchBar.text;
    });
}

export function loaded() {
    setTimeout(() => {
        viewModel.loadItems();
    }, 0);
}

export function onSelectItem(args: listViewModule.ItemEventData) {
    viewModel.toggleItem(args.index);

    if (!viewModel.get("multiple")) {
        closeCallback(viewModel.selectedItem);
    }
}

export function onValidate() {
    closeCallback(viewModel.selectedItems);
}

export function useNewElement() {
    if (!viewModel.get("multiple")) {
        viewModel.useNewElement();
        closeCallback(viewModel.selectedItem);
    }
}
