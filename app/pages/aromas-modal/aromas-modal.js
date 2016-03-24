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
           this.initialValues = data.map(v => { return { value: v, isSelected: false }});
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
        console.log(this.values.filter(v => v.isSelected));
    }

    // selectValue(selectedValue) {
    //     if(selectedValue.isSelected) {
    //         delete selectedValue.isSelected;
    //         _.remove(this.selectedValues, selectedValue);
    //     } else {
    //         this.selectedValues.push(_.clone(selectedValue));
    //         selectedValue.isSelected = true;
    //     }
    // }
}
