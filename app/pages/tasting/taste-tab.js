import {Page, NavParams} from 'ionic-angular';
import {WineData} from '../../providers/wine-data';

@Page({
  templateUrl: 'build/pages/tasting/taste-tab.html'
})
export class TasteTab {
    static get parameters() {
        return [[NavParams], [WineData]];
    }

    constructor(navParams, wineData) {
        this.navParams = navParams;
        this.wineData = wineData;

        this.tasting = this.navParams.get('tasting');
        this.saveTasting = this.navParams.get('onSave');

        this.attacks = [];
        this.balances = [];
        this.length = [];

        this.wineData.loadAttacks(this.tasting.informations.wineType).then(data => {
           this.attacks = data;
        });
        this.wineData.loadBalances(this.tasting.informations.wineType).then(data => {
           this.balances = data;
        });
        this.wineData.load('length').then(data => {
           this.length = data;
        });
    }

    selectCriteria(criteria, property) {
        if(criteria.isSelected) {
            delete criteria.isSelected;
            _.remove(this.tasting.taste[property], criteria);
        } else {
            this.tasting.taste[property].push(_.clone(criteria));
            criteria.isSelected = true;
        }
    }
}
