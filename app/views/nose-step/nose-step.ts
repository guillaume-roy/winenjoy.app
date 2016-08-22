import {NoseStepViewModel} from "../../view-models/nose-step-view-model";

var aromasAutoComplete;
var aromaDefectsAutoComplete;

export function loaded(args: any) {
    aromasAutoComplete = args.object.getViewById("aromas");
    aromasAutoComplete.android.setHint("Ajouter un arôme");
    aromasAutoComplete.android.setHintTextColor(android.graphics.Color.parseColor("#727272"));
    aromasAutoComplete.android.setTextSize(16);

    aromaDefectsAutoComplete = args.object.getViewById("aromaDefects");
    aromaDefectsAutoComplete.android.setHint("Ajouter un défaut d'arôme");
    aromaDefectsAutoComplete.android.setHintTextColor(android.graphics.Color.parseColor("#727272"));
    aromaDefectsAutoComplete.android.setTextSize(16);
}

export function selectAroma(args: { data: string, object: any }) {
    var vm = <NoseStepViewModel>args.object.bindingContext;
    vm.addAroma(args.data);
    aromasAutoComplete.android.setText("");
}

export function selectAromaDefect(args: { data: string, object: any }) {
    var vm = <NoseStepViewModel>args.object.bindingContext;
    vm.addAromaDefect(args.data);
    aromaDefectsAutoComplete.android.setText("");
}