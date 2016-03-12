import _ = require("lodash");
import {Observable} from "data/observable";
import {Services} from "../utils/services";
import {IAppService} from "../services/IAppService";
import {CriteriaItem} from "../entities/criteriaItem";

export class AromasPickerViewModel extends Observable {
    private _aromaCriterias: any[];
    private _aromaCriteriasSource: any[];
    private _service: IAppService;
    private _searchingText: string;
    private _selectedItems: CriteriaItem[];

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

    constructor(selectedAromas: CriteriaItem[]) {
        super();

        if (_.isArray(selectedAromas)) {
            this._selectedItems = selectedAromas;
        } else {
            this._selectedItems = [];
        }

        this._service = Services.current;

        this._service.getAromaCriteriasAsync()
            .then(data => {
                this._aromaCriteriasSource = _.orderBy(_.flattenDeep(
                    data.map(a => {
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
