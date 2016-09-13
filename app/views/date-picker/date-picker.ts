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
        var result = new Date(datePicker.year, datePicker.month, datePicker.day);
        closeCallback(result);
    });
}
