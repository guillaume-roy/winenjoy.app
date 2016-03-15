import {EventData} from "data/observable";
import {Page} from "ui/page";
import {TastingViewModel} from "../../view-models/tasting-view-model";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");
import appModule = require("application");
import {Views} from "../../utils/views";
import geolocation = require("nativescript-geolocation");
import {parse} from "ui/builder";
import fs = require("file-system");
import uilayoutslayout_base = require("ui/layouts/layout-base");

let viewModel: TastingViewModel;
let page: Page;
let lastTabContainer: uilayoutslayout_base.LayoutBase;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    setTimeout(function() {
        viewModel = new TastingViewModel();
        page.bindingContext = viewModel;

        if (geolocation.isEnabled()) {
            geolocation.getCurrentLocation({timeout: 5000}).
            then(function(loc) {
                viewModel.wineTasting.latitude = loc.latitude;
                viewModel.wineTasting.longitude = loc.longitude;
                viewModel.wineTasting.altitude = loc.altitude;
            });
        }

        // lastTabContainer = <uilayoutslayout_base.LayoutBase>page.getViewById("tab-5");
        // let xml = getViewContent("tasting-tab5.xml");
        // let view = parse(xml);
        // lastTabContainer.addChild(view);
        // console.log('ok');
    }, 0);
}

function getViewContent(templateUrl: string) {
        templateUrl = templateUrl.replace("~/", "");

        let fullFilePath = fs.path.join(fs.knownFolders.currentApp().path, "views/tasting", templateUrl);
        let fileContent;

        if (fs.File.exists(fullFilePath)) {
            let file = fs.File.fromPath(fullFilePath);
            let onError = function (error) {
                console.error("Error loading file " + fullFilePath + " :" + error.message);
                throw new Error("Error loading file " + fullFilePath + " :" + error.message);
            };
            fileContent = file.readTextSync(onError);
        }

        return fileContent;
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
