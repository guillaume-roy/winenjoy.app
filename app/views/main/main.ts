import {EventData} from "data/observable";
import {Page} from "ui/page";
import {MainViewModel} from "../../view-models/main-view-model";
import frameModule = require("ui/frame");
import {View} from "ui/core/view";
import {Views} from "../../utils/views";
import geolocation = require("nativescript-geolocation");
import appModule = require("application");
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
    button.icon = "res://blank";
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
        frameModule.topmost().navigate({
            animated: false,
            moduleName: Views.tasting,
            transition: null
        });

        button.animate({ // reset to original state
            curve: "easeIn",
            delay: 250,
            duration: 0,
            scale: { x: 1, y: 1 },
            translate: { x: 0, y: 0 },
        }).then(function(){
            button.icon = "res://ic_add_white_24dp";
        });
    });
}

export function onViewTasting(args: listViewModule.ItemEventData) {
    let wineTasting = viewModel.tastings[args.index];
    frameModule.topmost().navigate({
        animated: false,
        context: wineTasting,
        moduleName: Views.tasting,
        transition: null
    });
}

let finalRatingToImageConverterKey = "finalRatingToImageConverter";
appModule.resources[finalRatingToImageConverterKey] = function(value: string) {
    if (!value) {
        return null;
    }

    return "res://ic_" + value.toLowerCase();
};

let wineLocationConverterKey = "wineLocationConverter";
appModule.resources[wineLocationConverterKey] = function(value: any) {
    if (!value) {
        return null;
    }

    let result = "";

    if (value.region || value.country) {
        if (value.region) {
            result = value.region;
        }

        if (value.country) {
            if (result.length > 0) {
              result = result + " - " + value.country;
            } else {
                result = value.country;
            }
        }
    }

    return result;
};
