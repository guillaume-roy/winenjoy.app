import {EventData} from "data/observable";
import {Button} from "ui/button";
import {InformationsStepViewModel} from "../../view-models/informations-step-view-model";

var grapesAutoComplete;

export function loaded(args: any) {
    grapesAutoComplete = args.object.getViewById("grapes");
    grapesAutoComplete.android.setHint("Ajouter un cépage");
    grapesAutoComplete.android.setHintTextColor(android.graphics.Color.parseColor("#727272"));
    grapesAutoComplete.android.setTextSize(16);
}

export function selectGrape(args: { data: string, object: any }) {
    var vm = <InformationsStepViewModel>args.object.bindingContext;
    vm.selectGrape(args.data);
    grapesAutoComplete.android.setText("");
}

export function toggleIsBlindTasting(args: EventData) {
    var src = <Button>args.object;
    var vm = <InformationsStepViewModel>src.bindingContext;

    vm.isBlindTasting = !vm.isBlindTasting;
}