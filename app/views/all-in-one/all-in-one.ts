import {VisualStepViewModel} from "../../view-models/visual-step-view-model";
import {NoseStepViewModel} from "../../view-models/nose-step-view-model";
import {TasteStepViewModel} from "../../view-models/taste-step-view-model";
import {InformationsStepViewModel} from "../../view-models/informations-step-view-model";
import {RatingStepViewModel} from "../../view-models/rating-step-view-model";
import {EventData} from "data/observable";
import {Page} from "ui/page";
import {View} from "ui/core/view";
import scrollViewModule = require("ui/scroll-view");
import builder = require("ui/builder");
import profiler = require("../../utils/profiling");
import stackLayout = require("ui/layouts/stack-layout")
import {Progress} from "ui/progress";
import {Observable} from "data/observable";
import camera = require("camera");
import imageSource = require("image-source");
import dialogs = require("ui/dialogs");

let page: Page;
let scrollView: scrollViewModule.ScrollView;
let actionBarHeight: number;

let visualStep: View;
let noseStep: View;
let tasteStep: View;
let informationsStep: View;
let ratingStep: View;

let visualStepViewModel: VisualStepViewModel;
let noseStepViewModel: NoseStepViewModel;
let tasteStepViewModel: TasteStepViewModel;
let informationsStepViewModel: InformationsStepViewModel;
let ratingStepViewModel: RatingStepViewModel;

let allInOneViewModel: Observable;

export function navigatedTo(args: EventData) {
    profiler.stop("main-page");

    page = <Page>args.object;
    actionBarHeight = page.actionBar.getMeasuredHeight();
    scrollView = <scrollViewModule.ScrollView>page.getViewById("scrollView");

    scrollView.on(
        scrollViewModule.ScrollView.scrollEvent,
        (event: scrollViewModule.ScrollEventData) => handleActionBarTitle(event.scrollY));

    loadSteps();

    allInOneViewModel = new Observable({
        picture: imageSource.ImageSource = null
    });
    allInOneViewModel.set("picture", null);
    page.bindingContext = allInOneViewModel;
}

export function managePicture() {
    if (allInOneViewModel.get("picture")) {
        dialogs.confirm({
            message: "Etes-vous sûr de vouloir supprimer cette photo ?",
            cancelButtonText: "Non",
            okButtonText: "Oui",
            title: "Suppression"
        }).then(res => {
            if (res) {
                allInOneViewModel.set("picture", null);
            }
        });
    } else {
        camera.takePicture({
            height: 800,
            keepAspectRatio: true,
            width: 800
        }).then(img => {
            allInOneViewModel.set("picture", img);
        });
    }
}

export function saveTasting() {
    console.log("saveTasting");
}

function handleActionBarTitle(scrollY: number) {
    if (scrollY === 0) {
        page.actionBar.title = "Nouvelle dégustation";
        return;
    }

    if (scrollView.verticalOffset >= scrollView.scrollableHeight) {
        page.actionBar.title = "Conclusion";
        return;
    }

    var visualStepLocation = visualStep.getLocationOnScreen().y;
    var noseStepLocation = noseStep.getLocationOnScreen().y;
    var tasteStepLocation = tasteStep.getLocationOnScreen().y;
    var informationsStepLocation = informationsStep.getLocationOnScreen().y;
    var ratingStepLocation = ratingStep.getLocationOnScreen().y;

    if (ratingStepLocation - actionBarHeight <= 0) {
        page.actionBar.title = "Conclusion";
    } else if (informationsStepLocation - actionBarHeight <= 0) {
        page.actionBar.title = "Informations";
    } else if (tasteStepLocation - actionBarHeight <= 0) {
        page.actionBar.title = "Saveurs";
    } else if (noseStepLocation - actionBarHeight <= 0) {
        page.actionBar.title = "Arômes";
    } else if (visualStepLocation - actionBarHeight <= 0) {
        page.actionBar.title = "Aspect";
    }
}

function loadSteps() {
    setTimeout(() => {
        profiler.start("load-steps");

        visualStep = builder.load({
            page: page,
            name: "visual-step",
            path: "~/views/visual-step"
        });
        (<stackLayout.StackLayout>page.getViewById("visualStepContainer")).addChild(visualStep);
        visualStepViewModel = new VisualStepViewModel();
        visualStep.bindingContext = visualStepViewModel;

        noseStep = builder.load({
            page: page,
            name: "nose-step",
            path: "~/views/nose-step"
        });
        (<stackLayout.StackLayout>page.getViewById("noseStepContainer")).addChild(noseStep);
        noseStepViewModel = new NoseStepViewModel();
        noseStep.bindingContext = noseStepViewModel;

        tasteStep = builder.load({
            page: page,
            name: "taste-step",
            path: "~/views/taste-step"
        });
        (<stackLayout.StackLayout>page.getViewById("tasteStepContainer")).addChild(tasteStep);
        tasteStepViewModel = new TasteStepViewModel();
        tasteStep.bindingContext = tasteStepViewModel;

        informationsStep = builder.load({
            page: page,
            name: "informations-step",
            path: "~/views/informations-step"
        });
        (<stackLayout.StackLayout>page.getViewById("informationsStepContainer")).addChild(informationsStep);
        informationsStepViewModel = new InformationsStepViewModel();
        informationsStep.bindingContext = informationsStepViewModel;

        ratingStep = builder.load({
            page: page,
            name: "rating-step",
            path: "~/views/rating-step"
        });
        (<stackLayout.StackLayout>page.getViewById("ratingStepContainer")).addChild(ratingStep);
        ratingStepViewModel = new RatingStepViewModel();
        ratingStep.bindingContext = ratingStepViewModel;

        visualStepViewModel.init();
        noseStepViewModel.init();
        tasteStepViewModel.init();
        informationsStepViewModel.init();
        ratingStepViewModel.init();

        profiler.stop("load-steps");
    }, 200);
}