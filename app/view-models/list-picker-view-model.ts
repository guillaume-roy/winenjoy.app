import _ = require("lodash");
import {Observable} from "data/observable";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";

export class ListPickerViewModel extends Observable {
    private _items: any[];
    private _itemsSource: any[];
    private _searchingText: string;
    private _selectedItems: CriteriaItem[];
    private _searchBarHintText: string;

    public get items() {
        return this._items;
    }
    public set items(value) {
        this._items = value;
        this.notifyPropertyChange("items", value);
    }

    public get searchBarHintText() {
        return this._searchBarHintText;
    }
    public set searchBarHintText(value) {
        this._searchBarHintText = value;
        this.notifyPropertyChange("searchBarHintText", value);
    }

    public get searchingText() {
        return this._searchingText;
    }
    public set searchingText(value: string) {
        this._searchingText = value;
        this.notifyPropertyChange("searchingText", value);

        if (value.length === 0) {
            this.items = this._itemsSource;
        } else {
            this.items = this._itemsSource.filter(v => {
                return v.item.label.toLowerCase().startsWith(value.trim().toLowerCase());
            });
        }
    }

    public get selectedItems() {
        return this._selectedItems;
    }

    constructor(args: any) {
        super();

        this.searchBarHintText = args.searchBarHintText;

        if (_.isArray(args.selectedItems)) {
            this._selectedItems = args.selectedItems;
        } else {
            this._selectedItems = [];
        }

        if (args.criterias === "aromas") {
            new WineDataService().getCriterias("aromas")
                .then(data => {
                    this._itemsSource = _.orderBy(_.flattenDeep(
                        data.filter(d => d.code === "DEFECTS").map(a => {
                            return a.values.map(i => {
                                return new Observable({
                                    isSelected: _.some(this._selectedItems, i),
                                    item: i
                                });
                            });
                        })
                    ), ["item.label"]);
                    this.items = this._itemsSource;
                });
        } else {
            new WineDataService().getCriterias(args.criterias)
            .then(data => {
                this._itemsSource = data.map(a => {
                    return new Observable({
                        isSelected: _.some(this._selectedItems, a),
                        item: a
                    });
                });
                this.items = this._itemsSource;
            });
        }
    }

    public toggleItem(index: number) {
        let selectedItem = this.items[index];

        if (selectedItem.isSelected) {
            _.remove(this._selectedItems, selectedItem.item);
        } else {
            this._selectedItems.push(selectedItem.item);
        }

        selectedItem.isSelected = !selectedItem.isSelected;
    }
}
