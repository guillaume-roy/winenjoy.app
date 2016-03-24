import {Page, NavParams} from 'ionic-angular';
import {WineData} from '../../providers/wine-data';

@Page({
  templateUrl: 'build/pages/tasting/synthesis-tab.html'
})
export class SynthesisTab {
    static get parameters() {
        return [[NavParams], [WineData]];
    }

    constructor(navParams, wineData) {
        this.navParams = navParams;
        this.wineData = wineData;

        this.tasting = this.navParams.get('tasting');
        this.saveTasting = this.navParams.get('onSave');

        this.ratings = [];
        this.wineData.getRatings().then(data => {
            this.ratings = data;
        });
    }
}
