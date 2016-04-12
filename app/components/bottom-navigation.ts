import gridLayoutModule = require("ui/layouts/grid-layout");
import {Label} from "ui/label";
import dependencyObservableModule = require("ui/core/dependency-observable");
import {EventData} from "data/observable";
import frameModule = require("ui/frame");
import {Views} from "../utils/views";

export class BottomNavigation extends gridLayoutModule.GridLayout {
    public static selectedItemProperty = new dependencyObservableModule.Property(
        "selectedItem",
        "BottomNavigation",
        new dependencyObservableModule.PropertyMetadata(undefined, dependencyObservableModule.PropertyMetadataSettings.None,
        function(data: dependencyObservableModule.PropertyChangeData) {
            if (data.newValue) {
                let instance = <BottomNavigation>data.object;
                instance.setSelectedItem(data.newValue);
            }
        }));

    public get selectedItem() {
        return this._getValue(BottomNavigation.selectedItemProperty);
    }
    public set selectedItem(value: string) {
        this._setValue(BottomNavigation.selectedItemProperty, value);
    }

    private _items = [
        { code: "SIGHT", icon: 0xe90a, isLastIcon: false,  label: "Aspect" },
        { code: "SMELL", icon: 0xe90b, isLastIcon: false, label: "Arômes"},
        { code: "TASTE", icon: 0xe90c, isLastIcon: false, label: "Saveurs"},
        { code: "INFORMATIONS", icon: null, isLastIcon: true, label: "Informations"}];

    constructor() {
        super();

        this.createUi();
    }

    public setSelectedItem(selectedItem: string) {
        this.selectedItem = selectedItem;

        let icon = this.getViewById(selectedItem + "_ICON");
        icon.className = icon.className.replace("icon-unselected", "icon-selected");

        let label = this.getViewById(selectedItem + "_LABEL");
        label.className = "label-selected";
    }

    private createUi() {
        this.removeChildren();

        this.className = "bottom-navigation";

        this.addColumn(new gridLayoutModule.ItemSpec(1, "star"));
        this.addColumn(new gridLayoutModule.ItemSpec(1, "star"));
        this.addColumn(new gridLayoutModule.ItemSpec(1, "star"));
        this.addColumn(new gridLayoutModule.ItemSpec(1, "star"));

        for (let i = 0; i < this._items.length; i++) {
            let currentItem = this._items[i];

            let icon = new Label();
            icon.id = currentItem.code + "_ICON";
            icon.text = currentItem.isLastIcon ? "vignette" : String.fromCharCode(currentItem.icon);
            icon.className = currentItem.isLastIcon ? "material-icon wine-icon-unselected" : "winenjoy-icon icon-unselected";

            if (currentItem.code === "SMELL") {
                icon.className = icon.className + " aromas-icon";
            }

            icon.on("tap", args => this.onNavigate(args, currentItem.code));
            this.addChild(icon);
            gridLayoutModule.GridLayout.setColumn(icon, i);

            let label = new Label();
            label.id = currentItem.code + "_LABEL";
            label.text = currentItem.label;
            label.className = "label-unselected";
            label.on("tap", args => this.onNavigate(args, currentItem.code));
            this.addChild(label);
            gridLayoutModule.GridLayout.setColumn(label, i);
        }
    }

    private onNavigate(args: EventData, code: string) {
        let selectedLabel = <Label>args.object;

        if (selectedLabel.className.indexOf("icon-selected") > -1) {
            return;
        }

        let destinationUrl = "";

        switch (code) {
            case "SIGHT":
                destinationUrl = Views.sightTab;
                break;
            case "SMELL":
                destinationUrl = Views.smellTab;
                break;
            case "TASTE":
                destinationUrl = Views.tasteTab;
                break;
            case "INFORMATIONS":
                destinationUrl = Views.informationsTab;
                break;
        }

        frameModule.topmost().navigate({
            animated: false,
            backstackVisible: false,
            moduleName: destinationUrl
        });
    }
}
