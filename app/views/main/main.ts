import {EventData} from "data/observable";
import {Page} from "ui/page";
import {MainViewModel} from "../../view-models/main-view-model";
import frameModule = require("ui/frame");
import {View} from "ui/core/view";
import {Views} from "../../utils/views";
import geolocation = require("nativescript-geolocation");
import listViewModule = require("ui/list-view");
import {AnalyticsService} from "../../services/analyticsService";
import {ExportDataService} from "../../services/exportDataService";

let viewModel: MainViewModel;
let analyticsService: AnalyticsService;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;

    viewModel = new MainViewModel();
    page.bindingContext = viewModel;

    if (!geolocation.isEnabled()) {
        geolocation.enableLocationRequest();
    }

    analyticsService = new AnalyticsService();
    analyticsService.logView("main");
}

export function onExportTastings() {
    let exportDataService = new ExportDataService();
    exportDataService.exportTastingsToJson().then(res => {
        analyticsService.logEvent("Action", "User Input", "onExportTastings");
    });
}

export function onCreateNewTasting(args: EventData) {
    let button = <View>args.object;
    (<any>button).icon = "res://blank";
    button.animate({
        curve: "easeOut",
        duration: 250,
        scale: {
            x: 20,
            y: 20
        },
        translate: {
            x: -200,
            y: -200
        }
    }).then(v => {
        console.log(new Date().toISOString(), "navigating from main");
        analyticsService.logEvent("Navigation", "User Input", "onCreateNewTasting");
        analyticsService.startTimer("Navigation from main to edit-tasting", "Navigation", "onCreateNewTasting");

        frameModule.topmost().navigate({
            animated: false,
            backstackVisible: false,
            context: viewModel.newTasting(),
            moduleName: Views.editTasting
        });

        button.animate({ // reset to original state
            curve: "easeIn",
            delay: 250,
            duration: 0,
            scale: { x: 1, y: 1 },
            translate: { x: 0, y: 0 }
        }).then(function(){
            (<any>button).icon = "res://ic_add_white_24dp";
        });
    });
}

export function onCreateFirstTasting() {
    console.log(new Date().toISOString(), "navigating from main");
    analyticsService.logEvent("Navigation", "User Input", "onCreateFirstTasting");
    analyticsService.startTimer("Navigation from main to edit-tasting", "Navigation", "onCreateFirstTasting");
    frameModule.topmost().navigate({
        animated: false,
        backstackVisible: false,
        context: viewModel.newTasting(),
        moduleName: Views.editTasting
    });
}

export function onViewTasting(args: listViewModule.ItemEventData) {
    console.log(new Date().toISOString(), "navigating from main");
    analyticsService.logEvent("Navigation", "User Input", "onViewTasting");
    analyticsService.startTimer("Navigation from main to edit-tasting", "Navigation", "onViewTasting");
    frameModule.topmost().navigate({
        animated: false,
        backstackVisible: true,
        context: viewModel.tastings[args.index],
        moduleName: Views.editTasting
    });
}
