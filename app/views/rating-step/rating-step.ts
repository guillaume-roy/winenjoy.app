import {EventData} from "data/observable";
import {Label} from "ui/label";
import {RatingStepViewModel} from "../../view-models/rating-step-view-model";

export function selectFinalRating(args: EventData) {
    var src = <Label>args.object;
    var vm = <RatingStepViewModel>src.bindingContext;
    let finalRating = src.className.match(/final-rating-(\d)/)[1];
    vm.finalRating = parseInt(finalRating, 10);
}