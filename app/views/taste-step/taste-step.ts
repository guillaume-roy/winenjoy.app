import {TasteStepViewModel} from "../../view-models/taste-step-view-model";
import {Page} from "ui/page";
import {Views} from "../../utils/views";

let page: Page;

export function loaded(args: any) {
    page = args.object.page;
}

export function selectFlavors(args: { data: string, object: any }) {
    let viewModel: TasteStepViewModel = args.object.bindingContext;
    page.showModal(
        Views.groupingListPicker,
        {
            criterias: "aromas",
            groupingIcon: "whatshot",
            multiple: true,
            searchBarHintText: "Sélectionez des saveurs",
            selectedItems: viewModel.selectedFlavors
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.selectedFlavors = null;
                viewModel.selectedFlavors = data;
            }
        },
        true);
}

export function selectFlavorDefects(args: { data: string, object: any }) {
    let viewModel: TasteStepViewModel = args.object.bindingContext;
    page.showModal(
        Views.listPicker,
        {
            criterias: "aromas",
            groupingIcon: "whatshot",
            multiple: true,
            searchBarHintText: "Sélectionez des défauts de saveur",
            selectedItems: viewModel.selectedFlavorDefects
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.selectedFlavorDefects = null;
                viewModel.selectedFlavorDefects = data;
            }
        },
        true);
}