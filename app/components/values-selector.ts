import {WrapLayout} from "ui/layouts/wrap-layout";
import {EventData} from "data/observable";
import {ValueButton} from "./value-button";
import dependencyObservableModule = require("ui/core/dependency-observable");
import colorModule = require("color");

export class ValuesSelector extends WrapLayout {
    public static itemsProperty = new dependencyObservableModule.Property(
        "items",
        "ValuesSelector",
        new dependencyObservableModule.PropertyMetadata(
            [],
            dependencyObservableModule.PropertyMetadataSettings.None,
            function(data: dependencyObservableModule.PropertyChangeData) {
                if (data.newValue) {
                    let instance = <ValuesSelector>data.object;
                    instance.items = data.newValue;
                }
            }));

    public static deleteOnClickProperty = new dependencyObservableModule.Property(
        "deleteOnClick",
        "ValuesSelector",
        new dependencyObservableModule.PropertyMetadata(
            false,
            dependencyObservableModule.PropertyMetadataSettings.None));

    public static selectedItemsProperty = new dependencyObservableModule.Property(
        "selectedItems",
        "ValuesSelector",
        new dependencyObservableModule.PropertyMetadata(
            [],
            dependencyObservableModule.PropertyMetadataSettings.None));

    public static singleSelectionProperty = new dependencyObservableModule.Property(
        "singleSelection",
        "ValuesSelector",
        new dependencyObservableModule.PropertyMetadata(
            false,
            dependencyObservableModule.PropertyMetadataSettings.None));

    public get selectedItems() {
        return this._getValue(ValuesSelector.selectedItemsProperty);
    }
    public set selectedItems(value: any[]) {
        this._setValue(ValuesSelector.selectedItemsProperty, value);
    }

    public get deleteOnClick() {
        return this._getValue(ValuesSelector.deleteOnClickProperty);
    }
    public set deleteOnClick(value: boolean) {
        this._setValue(ValuesSelector.deleteOnClickProperty, value);
    }

    public get singleSelection() {
        return this._getValue(ValuesSelector.singleSelectionProperty);
    }
    public set singleSelection(value: boolean) {
        this._setValue(ValuesSelector.singleSelectionProperty, value);
    }

    public get items() {
        return this._getValue(ValuesSelector.itemsProperty);
    }
    public set items(value: any) {
        this._setValue(ValuesSelector.itemsProperty, value);
        this.createUI();
    }

    private _buttons: ValueButton[];

    constructor() {
        super();
        this.orientation = "horizontal";
        this._buttons = [];
    }

    private createUI() {
        this.removeChildren();
        let itemsLength = this.items.length;

        for (let i = 0; i < itemsLength; i++) {
            let itemButton = new ValueButton();
            itemButton.text = this.items[i].label;
            itemButton.value = this.items[i];
            itemButton.className = "values-selector-item";

            if (this.deleteOnClick) {
                itemButton.className = "values-selector-selected-item";
            }

            itemButton.on(ValueButton.tapEvent, (data: EventData) => {
                let clickedButton = <ValueButton>data.object;

                if (this.deleteOnClick) {
                    let itemIndex = this.items.indexOf(clickedButton.value);
                    if (itemIndex > -1) {
                        let newSelectedItems = this.items;
                        newSelectedItems.splice(itemIndex, 1);
                        this.items = newSelectedItems;
                    }
                    return;
                }

                if (clickedButton.className === "values-selector-item") {
                    if (this.singleSelection && this.selectedItems.length > 0) {
                        this.selectedItems = [];

                        for (let i = 0; i < this._buttons.length; i++) {
                            this._buttons[i].className = "values-selector-item";
                        }
                    }
                    this.selectedItems.push(clickedButton.value);

                    clickedButton.className = "values-selector-selected-item";
                } else {
                    let itemIndex = this.selectedItems.indexOf(clickedButton.value);
                    if (itemIndex > -1) {
                        let newSelectedItems = this.selectedItems;
                        newSelectedItems.splice(itemIndex, 1);
                        this.selectedItems = newSelectedItems;
                    }

                    clickedButton.className = "values-selector-item";
                }
            }, this);

            this._buttons.push(itemButton);
            this.addChild(itemButton);
        }
    }
}
