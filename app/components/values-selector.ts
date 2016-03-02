import {WrapLayout} from "ui/layouts/wrap-layout";
import {EventData} from "data/observable";
import {ValueButton} from "./value-button";
import dependencyObservableModule = require("ui/core/dependency-observable");

export class ValuesSelector extends WrapLayout {
    public static itemsProperty = new dependencyObservableModule.Property(
        "items",
        "ValuesSelector",
        new dependencyObservableModule.PropertyMetadata(
            undefined,
            dependencyObservableModule.PropertyMetadataSettings.None,
            function(data: dependencyObservableModule.PropertyChangeData) {
                if (data.newValue) {
                    let instance = <ValuesSelector>data.object;
                    instance.items = data.newValue;
                }
            }));

    public get items() {
        return this._getValue(ValuesSelector.itemsProperty);
    }
    public set items(value: any) {
        this._setValue(ValuesSelector.itemsProperty, value);
        this.createUI();
    }

    // TODO : Create selectedItems property

    constructor() {
        super();
        this.orientation = "horizontal";
    }

    private createUI() {
        let itemsLength = this.items.length;

        for (let i = 0; i < itemsLength; i++) {
            let itemButton = new ValueButton();
            itemButton.text = this.items[i].text;
            itemButton.value = this.items[i];

            itemButton.on(ValueButton.tapEvent, (data: EventData) => {
                let clickedButton = <ValueButton>data.object;

                if (!clickedButton.className || clickedButton.className.trim().length === 0) {
                    clickedButton.className = "values-selector-selected-item";
                } else {
                    clickedButton.className = "";
                }
            }, this);

            this.addChild(itemButton);
        }
    }
}
