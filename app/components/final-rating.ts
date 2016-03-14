import {StackLayout} from "ui/layouts/stack-layout";
import {EventData} from "data/observable";
import {Image} from "ui/image";
import dependencyObservableModule = require("ui/core/dependency-observable");

export class FinalRating extends StackLayout {
    public static selectedValueProperty = new dependencyObservableModule.Property(
        "selectedValue",
        "FinalRating",
        new dependencyObservableModule.PropertyMetadata(undefined, dependencyObservableModule.PropertyMetadataSettings.None));

    public get selectedValue() {
        return this._getValue(FinalRating.selectedValueProperty);
    }
    public set selectedValue(value: string) {
        this._setValue(FinalRating.selectedValueProperty, value);
    }

    private _imageSources: string[];
    private _images: Image[];

    constructor() {
        super();
        this.orientation = "horizontal";
        this._images = [];
        this._imageSources = [
            "res://ic_very_happy",
            "res://ic_happy",
            "res://ic_neutral",
            "res://ic_sad",
            "res://ic_very_sad"
        ];
        this.createUI();
    }

    private createUI() {
        let imageSourcesLength = this._imageSources.length;

        for (let i = 0; i < imageSourcesLength; i++) {
            let ratingImage = new Image();
            ratingImage.src = this._imageSources[i];
            ratingImage.height = 64;
            ratingImage.width = 64;
            ratingImage.className = "rating-item";

            ratingImage.on("tap", (data: EventData) => {
                let imagesLength = this._images.length;
                for (let i = 0; i < imagesLength; i++) {
                    this._images[i].className = "rating-item";
                }

                let tapedImage = <Image>data.object;
                tapedImage.className = "rating-item selected-rating-item";

                let imgSrc = <string>tapedImage.src;
                this.selectedValue = imgSrc.replace("res://ic_", "").toUpperCase();
            }, this);

            this._images.push(ratingImage);
            this.addChild(ratingImage);
        }
    }
}
