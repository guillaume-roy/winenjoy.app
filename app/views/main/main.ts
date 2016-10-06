import {EventData} from "data/observable";
import {Page} from "ui/page";
import {MainViewModel} from "../../view-models/main-view-model";
import frameModule = require("ui/frame");
import {View} from "ui/core/view";
import {Views} from "../../utils/views";
import listViewModule = require("ui/list-view");
import dialogs = require("ui/dialogs");
import application = require("application");
import {Config} from "../../utils/config";
import {AnimationCurve} from "ui/enums";
import {Animation} from "ui/animation";

let viewModel: MainViewModel;
let page: Page;

let overlayPanel: View;
let fabButtonFull: View;
let fabLabelFull: View;
let fabButtonLight: View;
let fabLabelLight: View;
let fabLabelNormal: View;

export function navigatedTo(args: EventData) {
    page = <Page>args.object;

    viewModel = new MainViewModel();
    page.bindingContext = viewModel;

    overlayPanel = page.getViewById("overlay-panel");
    fabButtonFull = page.getViewById("fab-button-full");
    fabLabelFull = page.getViewById("fab-label-full");
    fabButtonLight = page.getViewById("fab-button-light");
    fabLabelLight = page.getViewById("fab-label-light");
    fabLabelNormal = page.getViewById("fab-label-normal");

    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
            args.cancel = true;

            if (viewModel.get("menuIsOpen"))
                closeMenu();

            return false;
        });
    }

    setTimeout(() => {
        viewModel.init()
            .catch(error => {
                console.dump(error);
                dialogs.alert({
                    message: "Erreur lors du chargement des dégustations.",
                    title: "Erreur",
                    okButtonText: "OK"
                });
            });
    }, 0);

    setTimeout(() => {
        viewModel.needToUpdateApp().then(needToUpdate => {
            if (needToUpdate) {
                dialogs.alert({
                    message: "Une nouvelle mise à jour est disponible pour l'application.",
                    title: "Mise à jour",
                    okButtonText: "Mettre à jour"
                }).then(() => {
                    var config = new Config();
                    var intent = new android.content.Intent(
                        android.content.Intent.ACTION_VIEW,
                        android.net.Uri.parse(config.PlayStoreAppLink));
                    intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                    application.android.context.startActivity(intent);
                    application.android.foregroundActivity.finishAffinity();
                    java.lang.System.exit(0);
                });
            }
        });
    }, 0);
}

export function loaded() {
    closeMenu(true);
}

export function onCreateNewTastingNormal(args: EventData) {
    if (!viewModel.get("menuIsOpen")) {
        openMenu();
    } else {
        setTimeout(() => {
            frameModule.topmost()
                .navigate({
                    animated: false,
                    backstackVisible: false,
                    moduleName: Views.editTastingNormal
                });

        }, 0);
    }
}

export function onCreateNewTastingLight(args: EventData) {
    setTimeout(() => {
        frameModule.topmost()
            .navigate({
                animated: false,
                backstackVisible: false,
                moduleName: Views.editTastingLight
            });
    }, 0);
}

export function onCreateNewTastingFull(args: EventData) {
    setTimeout(() => {
        frameModule.topmost()
            .navigate({
                animated: false,
                backstackVisible: false,
                moduleName: Views.editTastingFull
            });
    }, 0);
}

export function onCreateFirstTasting() {
    setTimeout(() => {
        frameModule.topmost().navigate({
            animated: false,
            backstackVisible: false,
            moduleName: Views.editTastingNormal
        });
    }, 0);
}

export function onViewTasting(args: listViewModule.ItemEventData) {
    setTimeout(() => {
        frameModule.topmost().navigate({
            animated: false,
            backstackVisible: true,
            context: viewModel.get("tastings")[args.index],
            moduleName: Views.editTastingFull
        });
    }, 0);
}

export function refreshTastings() {
    setTimeout(() => {
        viewModel.refreshTastings()
            .catch(error => {
                console.dump(error);
                dialogs.alert({
                    message: "Erreur lors du chargement des dégustations.",
                    title: "Erreur",
                    okButtonText: "OK"
                });
            });
    }, 0);
}

export function onCloseMenu() {
    if (viewModel.get("menuIsOpen"))
        closeMenu();
}

function openMenu() {
    setTimeout(() => {
        viewModel.set("menuIsOpen", true);
        new Animation([
            {
                target: fabButtonFull,
                translate: { x: 0, y: -145 },
                opacity: 1,
                duration: 80,
                curve: AnimationCurve.easeOut,
                delay: 0
            },
            {
                target: fabLabelFull,
                translate: { x: 0, y: -135 },
                opacity: 1,
                duration: 80,
                curve: AnimationCurve.easeOut,
                delay: 0
            },
            {
                target: fabButtonLight,
                translate: { x: 0, y: -80 },
                opacity: 1,
                duration: 80,
                curve: AnimationCurve.easeOut,
                delay: 0
            },
            {
                target: fabLabelLight,
                translate: { x: 0, y: -70 },
                opacity: 1,
                duration: 80,
                curve: AnimationCurve.easeOut,
                delay: 0
            },
            {
                target: fabLabelNormal,
                opacity: 1,
                duration: 80,
                curve: AnimationCurve.easeOut,
                delay: 0
            },
            {
                target: overlayPanel,
                opacity: 0.8,
                duration: 50,
                curve: AnimationCurve.easeOut,
                delay: 0
            }
        ]).play();
    }, 0);
}

function closeMenu(force?: boolean) {
    setTimeout(() => {
        var duration = force ? 0 : 80;
        var overlayDuration = force ? 0 : 50;
        viewModel.set("menuIsOpen", false);
        new Animation([
            {
                target: fabButtonFull,
                translate: { x: 0, y: 0 },
                opacity: 0,
                duration: duration,
                curve: AnimationCurve.easeOut,
                delay: 0
            },
            {
                target: fabLabelFull,
                translate: { x: 0, y: 0 },
                opacity: 0,
                duration: duration,
                curve: AnimationCurve.easeOut,
                delay: 0
            },
            {
                target: fabButtonLight,
                translate: { x: 0, y: 0 },
                opacity: 0,
                duration: duration,
                curve: AnimationCurve.easeOut,
                delay: 0
            },
            {
                target: fabLabelLight,
                translate: { x: 0, y: 0 },
                opacity: 0,
                duration: duration,
                curve: AnimationCurve.easeOut,
                delay: 0
            },
            {
                target: fabLabelNormal,
                opacity: 0,
                duration: duration,
                curve: AnimationCurve.easeOut,
                delay: 0
            },
            {
                target: overlayPanel,
                opacity: 0,
                duration: overlayDuration,
                curve: AnimationCurve.easeOut,
                delay: 0
            }
        ]).play();
    }, 0);
}