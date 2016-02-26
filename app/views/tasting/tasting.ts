import {EventData} from "data/observable";
import {Page} from "ui/page";
import {TastingViewModel} from "../../view-models/tasting-view-model";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");
import appModule = require("application");
import {GradientColorPicker} from "../../components/gradient-color-picker";

let viewModel: TastingViewModel;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;
    viewModel = new TastingViewModel();
    page.bindingContext = viewModel;

    let gradientColorPicker = <GradientColorPicker>page.getViewById("gradientColorPicker");
    gradientColorPicker.generateGradient();
    // let lol = new GradientColorPicker("#3B022D", "#C23311", 20);
}

export function onSaveTasting() {
    viewModel.finishTasting();
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

appModule.resources["dateConverter"] = function(value) {
    let date = new Date(value);
    let day = date.getDate();
    let month = date.getMonth();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return (day < 10 ? "0" + day : day) + "/" + (month < 10 ? "0" + month : month) + "/" + date.getFullYear() +
        " " + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
};
