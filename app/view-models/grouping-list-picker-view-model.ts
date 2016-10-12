import _ = require("lodash");
import {Observable} from "data/observable";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineCriteriasService} from "../services/wineCriteriasService";

export class GroupingListPickerViewModel extends Observable {
    private _selectedItems: CriteriaItem[];

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
        this.set("isBusy", true);

        this.set("items", []);
        if (_.isArray(args.selectedItems)) {
            this._selectedItems = args.selectedItems;
        } else {
            this._selectedItems = [];
        }
    }

    loadItems() {
        this.set("isBusy", true);
        var wineCriteriasService = new WineCriteriasService();
        wineCriteriasService.getCriteriasFromFirebase("aromastree")
            .then(tree => {
                this.set("items", tree.map((t: CriteriaItem) => {
                    var obs = {
                        isSelected: false,
                        isExpanded: false,
                        item: _.cloneDeep(t)
                    };
                    obs.item.values = t.values.map(x => new Observable({
                        isSelected: _.some(this._selectedItems, { id: x.id }),
                        item: _.cloneDeep(x)
                    }));
                    return new Observable(obs);
                }));
                this.set("isBusy", false);
            });
    }

    toggleGroup(item: Observable) {
        _.each(_.reject(this.get("items"), item), (area: Observable) => {
            area.set("isExpanded", false);
        });
        item.set("isExpanded", !item.get("isExpanded"));
    }

    selectItem(item: any) {
        let selectedItem = _.find(_.flattenDeep(this.get("items").map(g => g.get("item").values)), (v: any) => v.item.id === item.item.id) || {};

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
}
