import {Page, NavParams, NavController, Events} from 'ionic-angular';
import {WineData} from '../../providers/wine-data';

@Page({
  templateUrl: 'build/pages/tasting/synthesis-tab.html'
})
export class SynthesisTab {
    static get parameters() {
        return [[NavParams], [WineData], [NavController], [Events]];
    }

    constructor(navParams, wineData, nav, events) {
        this.navParams = navParams;
        this.wineData = wineData;
        this.nav = nav;
        this.events = events;

        this.tasting = this.navParams.get('tasting');

        this.ratings = [];
        this.wineData.getRatings().then(data => {
            this.ratings = data;
        });
    }

    selectRating(ratingCode) {
         this.tasting.synthesis.rating = ratingCode;
    }

    saveTasting() {
        this.events.publish('tasting:save');
    }

    cancelTasting() {
        this.events.publish('tasting:cancel');
    }
}