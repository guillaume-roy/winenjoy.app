import pages = require("ui/page");
import {Page} from "ui/page";
import {AromasPickerViewModel} from "../../view-models/aromas-picker-view-model";
import {SearchBar} from "ui/search-bar";
import listViewModule = require("ui/list-view");

let closeCallback: Function;
let viewModel: AromasPickerViewModel;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;

    setTimeout(function() {
        viewModel = new AromasPickerViewModel(args.context);
        let page = <Page>args.object;
        page.bindingContext = viewModel;

        let searchBar = <SearchBar>page.getViewById("searchBar");
        searchBar.on(SearchBar.propertyChangeEvent, searchBarArgs => {
            viewModel.searchingText = searchBar.text;
        });
    }, 0);
}

export function onSelectAroma(args: listViewModule.ItemEventData) {
    viewModel.toggleItem(args.index);
}

export function onValidate() {
    closeCallback(viewModel.selectedItems);
}
