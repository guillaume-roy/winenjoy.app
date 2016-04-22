import _ = require("lodash");
import {Observable} from "data/observable";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";
import {Diacritics} from "../utils/diacritics";
import {UUID} from "../utils/uuid";

export class ListPickerViewModel extends Observable {
    private _items: any[];
    private _itemsSource: any[];
    private _searchingText: string;
    private _selectedItems: CriteriaItem[];
    private _searchBarHintText: string;
    private _diacriticsHelper: Diacritics;
    private _multiple: boolean;
    private _parentCode: string;

    public get parentCode() {
        return this._parentCode;
    }
    public set parentCode(value) {
        this._parentCode = value;
        this.notifyPropertyChange("parentCode", value);
    }

    public get multiple() {
        return this._multiple;
    }
    public set multiple(value) {
        this._multiple = value;
        this.notifyPropertyChange("multiple", value);
    }

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
                let searchTerm = this._diacriticsHelper.remove(value.trim()).toLowerCase();
                let currentTerm = this._diacriticsHelper.remove(v.item.label).toLowerCase();
                return currentTerm.indexOf(searchTerm) > -1;
            });
        }
    }

    public get selectedItems() {
        return this._selectedItems;
    }

    public get selectedItem() {
        return this._selectedItems[0];
    }

    constructor(args: any) {
        super();

        this._itemsSource = [];
        this.items = [];
        this._diacriticsHelper = new Diacritics();

        this.parentCode = args.parentCode;
        this.multiple = args.multiple;
        this.searchBarHintText = args.searchBarHintText;
        this.searchingText = "";

        if (_.isArray(args.selectedItems)) {
            this._selectedItems = args.selectedItems;
        } else {
            this._selectedItems = [];
        }

        if (args.criterias === "aromas") {
            new WineDataService().getCriterias("aromas")
                .then(data => {
                    this._itemsSource = _.orderBy(_.flattenDeep<Observable>(
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
                if (!_.isEmpty(this.parentCode)) {
                    data = data.filter(d => {
                        return d.parentCode === this.parentCode;
                    });
                }

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

        if (!this.multiple) {
            this._selectedItems = [ selectedItem.item ];
        } else {
            if (selectedItem.isSelected) {
                _.remove(this._selectedItems, selectedItem.item);
            } else {
                this._selectedItems.push(selectedItem.item);
            }

            selectedItem.isSelected = !selectedItem.isSelected;
        }
    }

    public useNewElement() {
        if (!this.multiple) {
            this._selectedItems = [{
                id: UUID.generate(),
                isCustom: true,
                label: _.capitalize(this.searchingText),
                parentCode: this.parentCode
            }];
        }
    }
}
