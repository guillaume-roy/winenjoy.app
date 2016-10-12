import _ = require("lodash");
import {Observable} from "data/observable";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineCriteriasService} from "../services/wineCriteriasService";
import {Diacritics} from "../utils/diacritics";
import {UUID} from "../utils/uuid";

export class ListPickerViewModel extends Observable {
    private _itemsSource: any[];
    private _searchingText: string;
    private _selectedItems: CriteriaItem[];
    private _diacriticsHelper: Diacritics;

    public get searchingText() {
        return this._searchingText;
    }
    public set searchingText(value: string) {
        this._searchingText = value;
        this.notifyPropertyChange("searchingText", value);

        if (value.length === 0) {
            this.set("items", this._itemsSource);
        } else {
            this.set("items", this._itemsSource.filter(v => {
                let searchTerm = this._diacriticsHelper.remove(value.trim()).toLowerCase();
                let currentTerm = this._diacriticsHelper.remove(v.item.label).toLowerCase();
                return currentTerm.indexOf(searchTerm) > -1;
            }));
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

        this.set("isBusy", true);
        this._itemsSource = [];
        this.set("items", []);
        this._diacriticsHelper = new Diacritics();

        this.set("criterias", args.criterias);
        this.set("parentId", args.parentId);
        this.set("multiple", args.multiple);
        this.set("searchBarHintText", args.searchBarHintText);
        this.searchingText = "";
        
        if (_.isArray(args.selectedItems)) {
            this._selectedItems = args.selectedItems;
        } else {
            this._selectedItems = [];
        }
    }

    loadItems() {
        this.set("isBusy", true);
        new WineCriteriasService().getCriteriasFromFirebase(this.get("criterias"), "label")
            .then(data => {
                this._itemsSource = data.map(a => {
                    return new Observable({
                        isSelected: _.some(this._selectedItems, a),
                        item: a
                    });
                });
                this.set("items", this._itemsSource);
                this.set("isBusy", false);
            });
    }

    toggleItem(index: number) {
        let selectedItem = this.get("items")[index];

        if (!this.get("multiple")) {
            this._selectedItems = [selectedItem.item];
        } else {
            if (selectedItem.isSelected) {
                _.remove(this._selectedItems, selectedItem.item);
            } else {
                this._selectedItems.push(selectedItem.item);
            }

            selectedItem.isSelected = !selectedItem.isSelected;
        }
    }

    useNewElement() {
        if (!this.get("multiple")) {
            this._selectedItems = [{
                id: UUID.generate(),
                isCustom: true,
                label: _.capitalize(this.searchingText),
                parentId: this.get("parentId")
            }];
        }
    }
}
