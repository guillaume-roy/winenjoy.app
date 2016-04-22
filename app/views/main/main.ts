import {EventData} from "data/observable";
import {Page} from "ui/page";
import {MainViewModel} from "../../view-models/main-view-model";
import frameModule = require("ui/frame");
import {View} from "ui/core/view";
import {Views} from "../../utils/views";
import geolocation = require("nativescript-geolocation");
import listViewModule = require("ui/list-view");

let viewModel: MainViewModel;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;

    viewModel = new MainViewModel();
    page.bindingContext = viewModel;

    if (!geolocation.isEnabled()) {
        geolocation.enableLocationRequest();
    }
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

    frameModule.topmost().navigate({
        animated: false,
        backstackVisible: false,
        context: viewModel.newTasting(),
        moduleName: Views.editTasting
    });
}

export function onViewTasting(args: listViewModule.ItemEventData) {
    // viewModel.edit(viewModel.tastings[args.index].id).then(result => {
    //     frameModule.topmost().navigate({
    //         animated: false,
    //         backstackVisible: false,
    //         moduleName: Views.sightTab
    //     });
    // });
}
