import {TasteStepViewModel} from "../../view-models/taste-step-view-model";

var flavorAutoComplete;
var flavorDefectsAutoComplete;

export function loaded(args: any) {
    flavorAutoComplete = args.object.getViewById("flavors");
    flavorAutoComplete.android.setHint("Ajouter une saveur");
    flavorAutoComplete.android.setHintTextColor(android.graphics.Color.parseColor("#727272"));
    flavorAutoComplete.android.setTextSize(16);

    flavorDefectsAutoComplete = args.object.getViewById("flavorDefects");
    flavorDefectsAutoComplete.android.setHint("Ajouter un défaut de saveur");
    flavorDefectsAutoComplete.android.setHintTextColor(android.graphics.Color.parseColor("#727272"));
    flavorDefectsAutoComplete.android.setTextSize(16);
}

export function selectAroma(args: { data: string, object: any }) {
    var vm = <TasteStepViewModel>args.object.bindingContext;
    vm.addFlavor(args.data);
    flavorAutoComplete.android.setText("");
}

export function selectAromaDefect(args: { data: string, object: any }) {
    var vm = <TasteStepViewModel>args.object.bindingContext;
    vm.addFlavorDefect(args.data);
    flavorDefectsAutoComplete.android.setText("");
}