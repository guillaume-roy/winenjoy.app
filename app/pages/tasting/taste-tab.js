import {Page, NavParams, NavController, Events} from 'ionic-angular';
import {WineData} from '../../providers/wine-data';

@Page({
  templateUrl: 'build/pages/tasting/taste-tab.html'
})
export class TasteTab {
    static get parameters() {
        return [[NavParams], [WineData], [NavController], [Events]];
    }

    constructor(navParams, wineData, nav, events) {
        this.navParams = navParams;
        this.wineData = wineData;
        this.nav = nav;
        this.events = events;

        this.tasting = this.navParams.get('tasting');

        this.attacks = [];
        this.balances = [];
        this.length = [];

        this.loadCriterias();

        this.wineData.load('length').then(data => {
           this.length = data;
        });

        this.events.subscribe('tasting:wineType', () => {
            this.loadCriterias();
        });
    }

    loadCriterias() {
       this.wineData.loadAttacks(this.tasting.informations.wineType).then(data => {
           this.attacks = data;
        });
        this.wineData.loadBalances(this.tasting.informations.wineType).then(data => {
           this.balances = data;
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

    saveTasting() {
        this.events.publish('tasting:save');
    }

    cancelTasting() {
        this.events.publish('tasting:cancel');
    }
}
