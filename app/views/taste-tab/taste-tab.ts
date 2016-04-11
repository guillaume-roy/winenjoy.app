import {EventData} from "data/observable";
import {Page} from "ui/page";
import {TasteTabViewModel} from "../../view-models/taste-tab-view-model";
import scrollViewModule = require("ui/scroll-view");

let viewModel: TasteTabViewModel;
let page: Page;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    setTimeout(() => {
       viewModel = new TasteTabViewModel();
        page.bindingContext = viewModel;

        manageFabVisibility();
    });
}

export function navigatedFrom() {
    viewModel.storeTasting();
}

function manageFabVisibility() {
    let scrollView = page.getViewById("scrollView");
    scrollView.on("scroll", (scrollEvent: scrollViewModule.ScrollEventData) => {
        let src = page.getViewById("fab");
        if (scrollEvent.scrollY !== 0) {
            src.animate({
                duration: 300,
                translate: {
                    x: 200,
                    y: 0
                }
            });
        } else {
            src.animate({
                duration: 300,
                translate: {
                    x: 0,
                    y: 0
                }
            });
        }
    });
}
