import {WrapLayout} from "ui/layouts/wrap-layout";
import {EventData} from "data/observable";
import {ValueButton} from "./value-button";
import dependencyObservableModule = require("ui/core/dependency-observable");
import _ = require("lodash");

export class ValuesSelector extends WrapLayout {
    static DEFAULT_CSS = "values-selector-item";
    private static SELECTED_CSS = "values-selector-selected-item";

    static itemsProperty = new dependencyObservableModule.Property(
        "items",
        "ValuesSelector",
        new dependencyObservableModule.PropertyMetadata(
            [],
            dependencyObservableModule.PropertyMetadataSettings.None,
            (data: dependencyObservableModule.PropertyChangeData) => {
                if (data.newValue) {
                    let instance = <ValuesSelector>data.object;
                    instance.items = data.newValue;
                }
            }));

    static deleteOnClickProperty = new dependencyObservableModule.Property(
        "deleteOnClick",
        "ValuesSelector",
        new dependencyObservableModule.PropertyMetadata(
            false,
            dependencyObservableModule.PropertyMetadataSettings.None));

    static selectedItemsProperty = new dependencyObservableModule.Property(
        "selectedItems",
        "ValuesSelector",
        new dependencyObservableModule.PropertyMetadata(
            [],
            dependencyObservableModule.PropertyMetadataSettings.None,
            (data: dependencyObservableModule.PropertyChangeData) => {
                if (data.newValue) {
                    let instance = <ValuesSelector>data.object;
                    instance.selectedItems = data.newValue;
                }
            }));

    static isEnabledProperty = new dependencyObservableModule.Property(
        "isEnabled",
        "ValuesSelector",
        new dependencyObservableModule.PropertyMetadata(
            true,
            dependencyObservableModule.PropertyMetadataSettings.None));

    get selectedItems() {
        return this._getValue(ValuesSelector.selectedItemsProperty);
    }
    set selectedItems(value: any[]) {
        this._setValue(ValuesSelector.selectedItemsProperty, value);
        this.bindSelectedItems();
    }

    get deleteOnClick() {
        return this._getValue(ValuesSelector.deleteOnClickProperty);
    }
    set deleteOnClick(value: boolean) {
        this._setValue(ValuesSelector.deleteOnClickProperty, value);
    }

    get isEnabled() {
        return this._getValue(ValuesSelector.isEnabledProperty);
    }
    set isEnabled(value: boolean) {
        this._setValue(ValuesSelector.isEnabledProperty, value);
    }

    get items() {
        return this._getValue(ValuesSelector.itemsProperty);
    }
    set items(value: any) {
        this._setValue(ValuesSelector.itemsProperty, value);
        this.createUI();
    }

    private _buttons: ValueButton[];

    constructor() {
        super();
        this.orientation = "horizontal";
    }

    private bindSelectedItems() {
        let selectedItemsLength = this.selectedItems.length;

        if (selectedItemsLength === 0 || this._buttons.length === 0) {
            return;
        }

        for (let i = 0; i < selectedItemsLength; i++) {
            let selectedItem = this.selectedItems[i];
            let selectedButton = _.find(this._buttons, b => _.isEqual(b.value, selectedItem));

            if (!_.isEmpty(selectedButton)) {
                selectedButton.className = ValuesSelector.SELECTED_CSS;
            }
        }
    }

    private createUI() {
        this.removeChildren();
        this._buttons = [];

        let itemsLength = this.items.length;
        for (let i = 0; i < itemsLength; i++) {
            let currentItem = this.items[i];
            let itemButton = new ValueButton();
            itemButton.text = currentItem.label;
            itemButton.value = currentItem;
            itemButton.className = this.deleteOnClick ? ValuesSelector.SELECTED_CSS : ValuesSelector.DEFAULT_CSS;

            if (this.isEnabled) {
                itemButton.on(ValueButton.tapEvent, this.onTapButton, this);
            }

            if (this.selectedItems.length > 0) {
                if (!_.isEmpty(_.find(this.selectedItems, currentItem))) {
                    itemButton.className = ValuesSelector.SELECTED_CSS;
                }
            }

            this._buttons.push(itemButton);
            this.addChild(itemButton);
        }
    }

    private onTapButton(data: EventData) {
        let clickedButton = <ValueButton>data.object;

        if (this.deleteOnClick) {
            _.remove(this.items, clickedButton.value);
            this.notifyPropertyChange("items", this.items);
            this.createUI();
            return;
        }

        if (clickedButton.className === ValuesSelector.DEFAULT_CSS) {
            this.selectedItems.push(clickedButton.value);
            clickedButton.className = ValuesSelector.SELECTED_CSS;
        } else {
            _.remove(this.selectedItems, clickedButton.value);
            clickedButton.className = ValuesSelector.DEFAULT_CSS;
        }

        this.notifyPropertyChange("selectedItems", this.selectedItems);
    }
}
