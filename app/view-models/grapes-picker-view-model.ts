import _ = require("lodash");
import {Observable} from "data/observable";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";

export class GrapesPickerViewModel extends Observable {
    private _grapeCriterias: any[];
    private _grapeCriteriasSource: any[];
    private _searchingText: string;
    private _selectedItems: CriteriaItem[];

    public get grapeCriterias() {
        return this._grapeCriterias;
    }
    public set grapeCriterias(value) {
        this._grapeCriterias = value;
        this.notifyPropertyChange("grapeCriterias", value);
    }

    public get searchingText() {
        return this._searchingText;
    }
    public set searchingText(value: string) {
        this._searchingText = value;
        this.notifyPropertyChange("searchingText", value);

        if (value.length === 0) {
            this.grapeCriterias = this._grapeCriteriasSource;
        } else {
            this.grapeCriterias = this._grapeCriteriasSource.filter(v => {
                return v.grape.label.toLowerCase().startsWith(value.trim().toLowerCase());
            });
        }
    }

    public get selectedItems() {
        return this._selectedItems;
    }

    constructor(args: any) {
        super();

        if (_.isArray(args)) {
            this._selectedItems = args;
        } else {
            this._selectedItems = [];
        }

        new WineDataService().getCriterias("grapes")
            .then(data => {
                this._grapeCriteriasSource = data.map(a => {
                    return new Observable({
                        grape: a,
                        isSelected: _.some(this._selectedItems, a)
                    });
                });
                this.grapeCriterias = this._grapeCriteriasSource;
            });
    }

    public toggleItem(index: number) {
        let selectedItem = this.grapeCriterias[index];

        if (selectedItem.isSelected) {
            let item = _.find(this._selectedItems, selectedItem.grape);
            if (item) {
                _.remove(this._selectedItems, item);
            }
        } else {
            this._selectedItems.push(selectedItem.grape);
        }

        selectedItem.isSelected = !selectedItem.isSelected;
    }
}
