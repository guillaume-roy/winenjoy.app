import {Page, NavParams, NavController, Events} from 'ionic-angular';
import {TastingsData} from '../../providers/tastings-data';

@Page({
  templateUrl: 'build/pages/tasting/informations-tab.html'
})
export class InformationsTab {
    static get parameters() {
        return [[TastingsData], [NavParams], [NavController], [Events]];
    }

    constructor(tastingsData, navParams, nav, events) {
        this.tastingsData = tastingsData;
        this.navParams = navParams;
        this.nav = nav;
        this.events = events;

        this.tasting = this.navParams.get('tasting');

        this.wineType = this.tasting.informations.wineType;
    }

    selectWineType() {
        if(this.wineType !== this.tasting.informations.wineType) {
            this.tasting.informations.wineType = this.wineType;
            this.tasting.sight.color = null;
            this.tasting.taste.attacks = [];
            this.tasting.taste.balances = [];

            this.events.publish('tasting:wineType');
        }
    }

    saveTasting() {
        this.events.publish('tasting:save');
    }

    cancelTasting() {
        this.events.publish('tasting:cancel');
    }
}
