import _ = require("lodash");
import {Observable} from "data/observable";
import {CriteriaItem} from "../entities/criteriaItem";
import {WineDataService} from "../services/wineDataService";

export class AromasPickerViewModel extends Observable {
    private _aromaCriterias: any[];
    private _aromaCriteriasSource: any[];
    private _searchingText: string;
    private _selectedItems: CriteriaItem[];
    private _isDefects: boolean;

    public get isDefects() {
        return this._isDefects;
    }
    public set isDefects(value) {
        this._isDefects = value;
        this.notifyPropertyChange("isDefects", value);
    }

    public get aromaCriterias() {
        return this._aromaCriterias;
    }
    public set aromaCriterias(value) {
        this._aromaCriterias = value;
        this.notifyPropertyChange("aromaCriterias", value);
    }

    public get searchingText() {
        return this._searchingText;
    }
    public set searchingText(value: string) {
        this._searchingText = value;
        this.notifyPropertyChange("searchingText", value);

        if (value.length === 0) {
            this.aromaCriterias = this._aromaCriteriasSource;
        } else {
            this.aromaCriterias = this._aromaCriteriasSource.filter(v => {
                return v.aroma.label.toLowerCase().startsWith(value.trim().toLowerCase());
            });
        }
    }

    public get selectedItems() {
        return this._selectedItems;
    }

    constructor(args: any) {
        super();

        this.isDefects = args.isDefects;

        if (_.isArray(args.values)) {
            this._selectedItems = args.values;
        } else {
            this._selectedItems = [];
        }

        new WineDataService().getCriterias("aromas")
            .then(data => {
                let filterFunction = this.isDefects
                    ? (d) => d.code === "DEFECTS"
                    : (d) => d.code !== "DEFECTS";

                this._aromaCriteriasSource = _.orderBy(_.flattenDeep<Observable>(
                    data.filter(filterFunction).map(a => {
                        return a.values.map(i => {
                            return new Observable({
                                aroma: i,
                                isSelected: _.some(this._selectedItems, i)
                            });
                        });
                    })
                ), ["aroma.label"]);
                this.aromaCriterias = this._aromaCriteriasSource;
            });
    }

    public toggleItem(index: number) {
        let selectedItem = this.aromaCriterias[index];

        if (selectedItem.isSelected) {
            let item = _.find(this._selectedItems, selectedItem.aroma);
            if (item) {
                _.remove(this._selectedItems, item);
            }
        } else {
            this._selectedItems.push(selectedItem.aroma);
        }

        selectedItem.isSelected = !selectedItem.isSelected;
    }
}
