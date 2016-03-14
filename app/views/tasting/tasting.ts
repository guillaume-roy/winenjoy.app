import {EventData} from "data/observable";
import {Page} from "ui/page";
import {TastingViewModel} from "../../view-models/tasting-view-model";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");
import appModule = require("application");
import {Views} from "../../utils/views";

let viewModel: TastingViewModel;
let page: Page;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    setTimeout(function() {
        viewModel = new TastingViewModel();
        page.bindingContext = viewModel;
    }, 0);
}

export function onSaveTasting() {
    viewModel.finishTasting();
}

export function onSelectColor() {
    page.showModal(
        Views.gradientColorPickerModal,
        viewModel.wineTasting,
        function(selectedColor) {
            viewModel.wineTasting.color = selectedColor;
            viewModel.notifyPropertyChange("wineTasting", viewModel.wineTasting);
        },
        true);
}

export function onAddAromas() {
    page.showModal(
        Views.aromasPicker,
        {
            isDefects: false,
            values: viewModel.wineTasting.aromas
        },
        function(data) {
            viewModel.setAromas(data);
        },
        true);
}

export function onAddDefects() {
    page.showModal(
        Views.aromasPicker,
        {
            isDefects: true,
            values: viewModel.wineTasting.defects
        },
        function(data) {
            viewModel.setDefects(data);
        },
        true);
}

export function cancel() {
    dialogs.confirm({
        cancelButtonText: "Non",
        message: "Etes-vous sûr de vouloir annuler cette dégustation ?",
        okButtonText: "Oui",
        title: "Annuler"
    }).then(result => {
        if (result) {
            frameModule.topmost().goBack();
        }
    });
}

let dateConverterKey = "dateConverter";
appModule.resources[dateConverterKey] = function(value) {
    let date = new Date(value);
    let day = date.getDate();
    let month = date.getMonth();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return (day < 10 ? "0" + day : day) + "/" + (month < 10 ? "0" + month : month) + "/" + date.getFullYear() +
        " " + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
};

let labelConverterKey = "labelConverter";
appModule.resources[labelConverterKey] = function(value) {
    if (value && value.length > 0) {
        return value.map(v => {
            return v.label;
        });
    } else {
        return [];
    }
};
