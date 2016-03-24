import {Page, NavController} from 'ionic-angular';
import {TastingsData} from '../../providers/tastings-data';
import {TastingPage} from '../tasting/tasting';

@Page({
  templateUrl: 'build/pages/tastings/tastings.html'
})
export class TastingsPage {
    static get parameters() {
        return [[NavController], [TastingsData]];
    }

    constructor(nav, tastingsData) {
        this.nav = nav;
        this.tastingsData = tastingsData;

        this.tastings = [];

        this.tastingsData.getTastings().then(data => {
           this.tastings = data;
        });
    }

    viewTasting(tasting) {
        console.log(tasting);
    }

    createTasting() {
        this.nav.push(TastingPage);
    }
}
