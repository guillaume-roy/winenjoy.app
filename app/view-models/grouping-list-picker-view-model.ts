import _ = require("lodash");
import {Observable} from "data/observable";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";

export class GroupingListPickerViewModel extends Observable {
    private _selectedItems: CriteriaItem[];
    private _items: Observable[];
    private _searchingText: string;
    private _searchBarHintText: string;
    private _groupingIcon: string;
    private _multiple: boolean;

    public get multiple() {
        return this._multiple;
    }
    public set multiple(value) {
        this._multiple = value;
        this.notifyPropertyChange("multiple", value);
    }

    public get searchBarHintText() {
        return this._searchBarHintText;
    }
    public set searchBarHintText(value) {
        this._searchBarHintText = value;
        this.notifyPropertyChange("searchBarHintText", value);
    }

    public get groupingIcon() {
        return this._groupingIcon;
    }
    public set groupingIcon(value) {
        this._groupingIcon = value;
        this.notifyPropertyChange("groupingIcon", value);
    }

    public get items() {
        return this._items;
    }
    public set items(value) {
        this._items = value;
        this.notifyPropertyChange("items", value);
    }

    public get searchingText() {
        return this._searchingText;
    }
    public set searchingText(value) {
        this._searchingText = value;
        this.notifyPropertyChange("searchingText", value);
    }

    public get selectedItem() {
        return this._selectedItems[0];
    }

    public get selectedItems() {
        return this._selectedItems;
    }

    constructor(args: any) {
        super();

        this.multiple = args.multiple;
        this.searchBarHintText = args.searchBarHintText;
        this.groupingIcon = args.groupingIcon;

        this.items = [];
        if (_.isArray(args.selectedItems)) {
            this._selectedItems = args.selectedItems;
        } else {
            this._selectedItems = [];
        }

        if (args.criterias === "aromas") {
            new WineDataService().getCriterias(args.criterias).then(data => {
                this.items = this.processChild(data.filter(d => d.type !== "DEFECTS").map(g => new Observable({
                    groupingIcon: this.groupingIcon,
                    isExpanded: false,
                    item: g
                })));
            });
        } else {
            new WineDataService().getCriterias(args.criterias).then(data => {
                this.items = this.processChild(data.map(g => new Observable({
                    groupingIcon: this.groupingIcon,
                    isExpanded: false,
                    item: g
                })));
            });
        }
    }

    public toggleGroup(item: Observable) {
        _.each(_.reject(this.items, item), area => {
            area.set("isExpanded", false);
        });
        item.set("isExpanded", !item.get("isExpanded"));
    }

    public selectItem(item: any) {
        let selectedItem = _.find(_.flattenDeep(this.items.map(g => g.get("item").values)), v => v.item.id === item.item.id) || {};

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

    private processChild(items) {
        _.each(items, i => {
           i.item.values = _.sortBy(i.item.values, ["order", "label"]).map(v => new Observable({
               isSelected: _.some(this._selectedItems, v),
               item: v
           }));
        });

        return items;
    }
}
