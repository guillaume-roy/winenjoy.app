import {EventData} from "data/observable";
import {Page} from "ui/page";
import {InformationsTabViewModel} from "../../view-models/informations-tab-view-model";
import {Views} from "../../utils/views";
import _ = require("lodash");
import editTastingUtils = require("../../utils/edit-tasting");

let viewModel: InformationsTabViewModel;
let page: Page;

export function loaded(args: EventData) {
    page = <Page>args.object;

    viewModel = new InformationsTabViewModel();
    page.bindingContext = viewModel;
}

export function navigatedTo(args: EventData) {
    setTimeout(() => {
        editTastingUtils.attachBackButtonConfirmation(viewModel);
        editTastingUtils.manageFabVisibility("scrollView", "fab", "fab-delete", page);
    });
}

export function navigatedFrom() {
    editTastingUtils.detachBackButtonConfirmation(viewModel);
    editTastingUtils.navigatedFrom(viewModel);
}

export function saveTasting() {
    editTastingUtils.saveTasting(viewModel);
}

export function deleteTasting() {
    editTastingUtils.deleteTasting(viewModel);
}

export function onSelectCountry() {
    page.showModal(
        Views.groupingListPicker,
        {
            criterias: "countries",
            groupingIcon: "public",
            multiple: false,
            searchBarHintText: "Sélectionnez un pays"
        },
        data => {
            if (!_.isEmpty(data)) {
                viewModel.setCountry(data);
            }
        },
        true);
}

export function onDeleteCountry() {
    viewModel.setCountry(null);
}

export function onSelectRegion() {
   page.showModal(
        Views.listPicker,
        {
            criterias: "regions",
            searchBarHintText: "Rechercher une région",
            selectedItems: viewModel.wineTasting.region
        },
        function(selectedRegion) {
            viewModel.setRegion(selectedRegion);
        },
        true);
}

export function onDeleteRegion() {
    viewModel.setCountry(null);
}

export function onSelectAoc() {
   page.showModal(
        Views.listPicker,
        {
            criterias: "aoc",
            searchBarHintText: "Rechercher un AOC",
            selectedItems: viewModel.wineTasting.aoc
        },
        function(selectedAoc) {
            viewModel.setAoc(selectedAoc);
        },
        true);
}

export function onDeleteAoc() {
    viewModel.setCountry(null);
}

export function onSelectYear() {
    page.showModal(
        Views.yearPicker,
        viewModel.wineTasting.year,
        data => {
            if (_.isNumber(data)) {
                viewModel.setYear(data);
            }
        },
        false);
}

export function onDeleteYear() {
    viewModel.setYear(null);
}

export function onSelectGrapes() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "grapes",
            searchBarHintText: "Rechercher un cépage",
            selectedItems: viewModel.wineTasting.grapes
        },
        function(selectedGrapes) {
            if (_.isArray(selectedGrapes)) {
                viewModel.setGrapes(selectedGrapes);
            }
        },
        true);
}
