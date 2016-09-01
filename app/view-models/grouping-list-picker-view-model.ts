import _ = require("lodash");
import {Observable} from "data/observable";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineCriteriasService} from "../services/wineCriteriasService";

export class GroupingListPickerViewModel extends Observable {
    private _selectedItems: CriteriaItem[];
    private _items: Observable[];
    
    public get items() {
        return this._items;
    }
    public set items(value) {
        this._items = value;
        this.notifyPropertyChange("items", value);
    }

    public get selectedItem() {
        return this._selectedItems[0];
    }

    public get selectedItems() {
        return this._selectedItems;
    }

    constructor(args: any) {
        super();

        this.set("multiple", args.multiple);
        this.set("searchBarHintText", args.searchBarHintText);
        this.set("groupingIcon", args.groupingIcon);

        this.items = [];
        if (_.isArray(args.selectedItems)) {
            this._selectedItems = args.selectedItems;
        } else {
            this._selectedItems = [];
        }

        if (args.criterias === "aromas") {
            new WineCriteriasService().getCriterias(args.criterias).then(data => {
                this.items = this.processChild(data.filter(d => d.code !== "DEFECTS").map(g => new Observable({
                    groupingIcon: this.get("groupingIcon"),
                    isExpanded: false,
                    item: g
                })));
            });
        } else {
            new WineCriteriasService().getCriterias(args.criterias).then(data => {
                this.items = this.processChild(data.map(g => new Observable({
                    groupingIcon: this.get("groupingIcon"),
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

        if (!this.get("multiple")) {
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
