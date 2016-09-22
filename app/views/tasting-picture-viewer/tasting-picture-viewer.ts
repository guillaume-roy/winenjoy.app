import pages = require("ui/page");
import {Observable} from "data/observable";
import {TastingsService} from "../../services/tastingsService";
import dialogs = require("ui/dialogs");

let closeCallback: Function;
let vm: Observable;

export function onShownModally(args: pages.ShownModallyData) {
    closeCallback = args.closeCallback;
    let page = <pages.Page>args.object;

    vm = new Observable();
    page.bindingContext = vm;

    var tastingId = args.context.tastingId;
    if (tastingId) {
        var tastingService = new TastingsService();
        tastingService.getTastingPictureUrl(tastingId)
            .then(url => {
                vm.set("src", url);
            });
    } else {
        vm.set("src", args.context.img);
    }
}

export function closeModal() {
    closeCallback();
}

export function deletePicture() {
    dialogs.confirm({
        cancelButtonText: "Annuler",
        message: "Etes-vous sur de vouloir supprimer cette photo ?",
        okButtonText: "OK",
        title: "Suppression"
    }).then(res => {
        if (res) {
            closeCallback(true);
        }
    });
}