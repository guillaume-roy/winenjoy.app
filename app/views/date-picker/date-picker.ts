import pages = require("ui/page");
import {Observable} from "data/observable";
import moment = require("moment");
import platform = require("platform");

let closeCallback: Function;
let vm: Observable;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;

    let page = <pages.Page>args.object;

    moment.locale(platform.device.language);
    var selectedDate = moment(args.context.selectedDate);
    vm = new Observable({
        day: selectedDate.date(),
        month: selectedDate.month() + 1,
        year: selectedDate.year()
    });
    page.bindingContext = vm;
}

export function cancelModal() {
    closeCallback();
}

export function okModal() {
    closeCallback(new Date(
        vm.get("year"),
        vm.get("month") - 1,
        vm.get("day")));
}