import {Page} from "ui/page";
import {NoseStepViewModel} from "../../view-models/nose-step-view-model";
import {Views} from "../../utils/views";

let page: Page;

export function loaded(args: any) {
    page = args.object.page;
}

export function selectAromas(args: any) {
    let viewModel: NoseStepViewModel = args.object.bindingContext;
    page.showModal(
        Views.groupingListPicker,
        {
            criterias: "aromas",
            groupingIcon: "whatshot",
            multiple: true,
            searchBarHintText: "Sélectionez des arômes",
            selectedItems: viewModel.selectedAromas
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.selectedAromas = null;
                viewModel.selectedAromas = data;
            }
        },
        true);
}

export function selectAromaDefects(args: any) {
    let viewModel: NoseStepViewModel = args.object.bindingContext;
    page.showModal(
        Views.groupingListPicker,
        {
            criterias: "aromas",
            groupingIcon: "whatshot",
            isDefects: true,
            multiple: true,
            searchBarHintText: "Sélectionez des défauts d'arôme",
            selectedItems: viewModel.selectedAromaDefects
        },
        (data: any[]) => {
            if (data && data.length > 0) {
                viewModel.selectedAromaDefects = null;
                viewModel.selectedAromaDefects = data;
            }
        },
        true);
}
