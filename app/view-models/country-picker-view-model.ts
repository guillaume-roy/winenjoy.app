import _ = require("lodash");
import {Observable} from "data/observable";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";

export class CountryPickerViewModel extends Observable {
    private _selectedItem: CriteriaItem;
    private _geoData: Observable[];
    private _searchingText: string;

    public get geoData() {
        return this._geoData;
    }
    public set geoData(value) {
        this._geoData = value;
        this.notifyPropertyChange("geoData", value);
    }

    public get searchingText() {
        return this._searchingText;
    }
    public set searchingText(value) {
        this._searchingText = value;
        this.notifyPropertyChange("searchingText", value);
    }

    public get selectedItem() {
        return this._selectedItem;
    }

    constructor(args: CriteriaItem) {
        super();

        this.geoData = [];
        new WineDataService().getCriterias("geo").then(geoData => {
            this.geoData = geoData.map(g => new Observable({
                isExpanded: false,
                value: g
            }));
        });
    }

    public toggleArea(item: Observable) {
        _.each(_.reject(this.geoData, item), area => {
            area.set("isExpanded", false);
        });
        item.set("isExpanded", !item.get("isExpanded"));
    }

    public selectCountry(item: Observable) {
        this._selectedItem = _.find(_.flattenDeep(this.geoData.map(g => g.get("value").values)), v => v.id === item.id));
    }
}
