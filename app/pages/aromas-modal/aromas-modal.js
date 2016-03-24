import {Page, NavParams, ViewController} from 'ionic-angular';
import {WineData} from '../../providers/wine-data';
import * as _ from 'lodash';

@Page({
  templateUrl: 'build/pages/aromas-modal/aromas-modal.html'
})
export class AromasModal {
    static get parameters() {
        return [[NavParams], [ViewController], [WineData]];
    }

    constructor(navParams, viewController, wineData) {
        this.navParams = navParams;
        this.viewController = viewController;
        this.wineData = wineData;

        this.valuesQuery = "";

        this.isDefects = this.navParams.get('isDefects');
        this.selectedValues = this.navParams.get('selectedValues') || [];

        this.initialValues = [];
        this.values = [];
        this.wineData.loadAromas(this.isDefects).then(data => {
           this.initialValues = data.map(v => {
               var isSelected = _.some(this.selectedValues, v);
               return { value: v, isSelected: isSelected }
            });
           this.values = this.initialValues;
        });
    }

    searchValues() {
        var searchQuery = this.valuesQuery.trim();
        if(searchQuery === '') {
            this.values = this.initialValues;
        } else {
            this.values = this.initialValues.filter(v => {
                return v.value.label.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
            });
        }
    }

    validate() {
        this.viewController.dismiss(this.initialValues.filter(v => v.isSelected).map(v => v.value));
    }

    selectValue(selectedValue) {
        selectedValue.isSelected = !selectedValue.isSelected;
    }
}
