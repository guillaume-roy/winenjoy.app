import pages = require("ui/page");
import {EventData} from "data/observable";
import application = require("application");

let closeCallback: Function;
let page: pages.Page;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;
    page = <pages.Page>args.object;
}