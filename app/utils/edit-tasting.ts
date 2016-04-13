import {Page} from "ui/page";
import {Views} from "../utils/views";
import scrollViewModule = require("ui/scroll-view");
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");
import {EditTastingViewModel} from "../view-models/edit-tasting-view-model";

export function navigatedFrom(viewModel: EditTastingViewModel) {
    viewModel.storeTasting();
}

export function saveTasting(viewModel: EditTastingViewModel) {
    setTimeout(() => {
        viewModel.saveTasting().then(result => {
            frameModule.topmost().navigate({
                animated: false,
                backstackVisible: false,
                moduleName: Views.main
            });
        });
    }, 0);
}

export function deleteTasting(viewModel: EditTastingViewModel) {
    dialogs.confirm({
        cancelButtonText: "Non",
        message: "Etes-vous sûr de vouloir supprimer cette dégustation ?",
        okButtonText: "Oui",
        title: "Suppression"
    }).then(result => {
        if (result) {
            setTimeout(() => {
                viewModel.deleteTasting().then(r => {
                    frameModule.topmost().navigate({
                        animated: false,
                        backstackVisible: false,
                        moduleName: Views.main
                    });
                });
            }, 0);
        }
    });
}

export function manageFabVisibility(scrollViewId: string, fabButtonId: string, fabDeleteButtonId: string, page: Page) {
    let scrollView = page.getViewById(scrollViewId);

    if (scrollView) {
        scrollView.on("scroll", (scrollEvent: scrollViewModule.ScrollEventData) => {
            let fabButton = page.getViewById(fabButtonId);
            let fabDeleteButton = page.getViewById(fabDeleteButtonId);
            let fabButtonDelay = 0;

            if (fabDeleteButton) {
                fabButtonDelay = 100;

                if (scrollEvent.scrollY !== 0) {
                    fabDeleteButton.animate({
                        duration: 300,
                        translate: {
                            x: 200,
                            y: 0
                        }
                    });
                } else {
                    fabDeleteButton.animate({
                        duration: 300,
                        translate: {
                            x: 0,
                            y: 0
                        }
                    });
                }
            }

            if (fabButton) {
                if (scrollEvent.scrollY !== 0) {
                    fabButton.animate({
                        delay: fabButtonDelay,
                        duration: 300,
                        translate: {
                            x: 200,
                            y: 0
                        }
                    });
                } else {
                    fabButton.animate({
                        delay: fabButtonDelay,
                        duration: 300,
                        translate: {
                            x: 0,
                            y: 0
                        }
                    });
                }
            }
        });
    }
}
