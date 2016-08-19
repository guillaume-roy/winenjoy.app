import {EventData} from "data/observable";
import {Button} from "ui/button";
import {InformationsStepViewModel} from "../../view-models/informations-step-view-model";

export function toggleIsBlindTasting(args: EventData) {
    var src = <Button>args.object;
    var vm = <InformationsStepViewModel>src.bindingContext;

    vm.isBlindTasting = !vm.isBlindTasting;
}