import {Page, NavParams} from 'ionic-angular';
import {TastingsData} from '../../providers/tastings-data';

@Page({
  templateUrl: 'build/pages/tasting/informations-tab.html'
})
export class InformationsTab {
    static get parameters() {
        return [[TastingsData], [NavParams]];
    }

    constructor(tastingsData, navParams) {
        this.tastingsData = tastingsData;
        this.navParams = navParams;

        this.tasting = this.navParams.get('tasting');
        this.saveTasting = this.navParams.get('onSave');
    }
}
