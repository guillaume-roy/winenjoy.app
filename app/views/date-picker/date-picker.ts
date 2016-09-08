import pages = require("ui/page");
import {Observable} from "data/observable";
import datePickerModule = require("ui/date-picker");
import {EventData} from "data/observable";

let closeCallback: Function;
let page: pages.Page;
let datePicker: datePickerModule.DatePicker;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;
    page = <pages.Page>args.object;

    datePicker = <datePickerModule.DatePicker>page.getViewById("datePicker");
    datePicker.date = args.context.selectedDate;
    datePicker.on(datePickerModule.DatePicker.propertyChangeEvent, (args: EventData) => {
        console.log("-------------------");
        console.log(args);
        console.log(args.eventName);
        console.log(args.object);
        console.log(datePicker.date);
        console.log("FINISH -------------------");
    });
}

function onSelectedDateChanged(args: EventData) {
    console.log("-------------------");
    console.log(args.eventName);
    console.log(args.object);
    console.log(datePicker.date);

    //setTimeout(() => {
    //    datePicker.off(datePickerModule.DatePicker.propertyChangeEvent);
    //    closeCallback(datePicker.date);
    //}, 50);
}