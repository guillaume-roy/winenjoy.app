import {EventData} from "data/observable";
import {Page} from "ui/page";
import dialogs = require("ui/dialogs");
import camera = require("camera");
import profiler = require("../../utils/profiling");
import {EditTastingViewModel} from "../../view-models/edit-tasting-view-model";
import {Views} from "../../utils/views";

let page: Page;

let viewModel: EditTastingViewModel;

export function navigatedTo(args: EventData) {
    profiler.start("loading edit-tasting");
    page = <Page>args.object;
    viewModel = new EditTastingViewModel();

    page.bindingContext = viewModel;

    profiler.start("init edit-tasting-view-model");
    viewModel.init();
    profiler.stop("init edit-tasting-view-model");
}

export function loaded() {
    profiler.stop("loading edit-tasting");
}

export function managePicture() {
    if (viewModel.get("picture")) {
        dialogs.confirm({
            message: "Etes-vous sûr de vouloir supprimer cette photo ?",
            cancelButtonText: "Non",
            okButtonText: "Oui",
            title: "Suppression"
        }).then(res => {
            if (res) {
                viewModel.set("picture", null);
            }
        });
    } else {
        camera.takePicture({
            height: 800,
            keepAspectRatio: true,
            width: 800
        }).then(img => {
            viewModel.set("picture", img);
        });
    }
}

export function saveTasting() {
    viewModel.saveTasting();
}

export function selectAromas() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "aromas",
            groupingIcon: "whatshot",
            multiple: true,
            searchBarHintText: "Sélectionez des arômes",
            selectedItems: viewModel.get("selectedAromas")
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.set("selectedAromas", null);
                viewModel.set("selectedAromas", data);
            }
        },
        true);
}

export function selectAromaDefects() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "aromaDefects",
            groupingIcon: "whatshot",
            multiple: true,
            searchBarHintText: "Sélectionez des défauts d'arôme",
            selectedItems: viewModel.get("selectedAromaDefects")
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.set("selectedAromaDefects", null);
                viewModel.set("selectedAromaDefects", data);
            }
        },
        true);
}

export function selectFlavors() {
    page.showModal(
        Views.groupingListPicker,
        {
            criterias: "aromas",
            groupingIcon: "whatshot",
            multiple: true,
            searchBarHintText: "Sélectionez des saveurs",
            selectedItems: viewModel.get("selectedFlavors")
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.set("selectedFlavors", null);
                viewModel.set("selectedFlavors", data);
            }
        },
        true);
}

export function selectFlavorDefects() {
    page.showModal(
        Views.listPicker,
        {
            criterias: "aromas",
            groupingIcon: "whatshot",
            multiple: true,
            searchBarHintText: "Sélectionez des défauts de saveur",
            selectedItems: viewModel.get("selectedFlavorDefects")
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.set("selectedFlavorDefects", null);
                viewModel.set("selectedFlavorDefects", data);
            }
        },
        true);
}

export function setTastingDate() {
    page.showModal(
        Views.datePicker,
        {
            selectedDate: viewModel.get("tastingDate")
        },
        (data: any) => {
            console.log(data);
            if (data) {
                viewModel.set("tastingDate", null);
                viewModel.set("tastingDate", data);
            }
        });
}