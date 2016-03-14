import {EventData} from "data/observable";
import {Page} from "ui/page";
import {MainViewModel} from "../../view-models/main-view-model";
import frameModule = require("ui/frame");
import {View} from "ui/core/view";
import {Views} from "../../utils/views";

let viewModel: MainViewModel;

export function navigatedTo(args: EventData) {
    let page = <Page>args.object;
    viewModel = new MainViewModel();
    page.bindingContext = viewModel;
}

export function onCreateNewTasting(args: EventData) {
    let button = <View>args.object;
    button.icon = "res://blank";
    button.animate({
       duration: 300,
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
            delay: 300,
            duration: 0,
            scale: { x: 1, y: 1 },
            translate: { x: 0, y: 0 },
        }).then(function(){
            button.icon = "res://ic_add_white_24dp";
        });
    });
}
