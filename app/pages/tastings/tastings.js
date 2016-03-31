import {Page, NavController, Events} from 'ionic-angular';
import {TastingsData} from '../../providers/tastings-data';
import {TastingPage} from '../tasting/tasting';

@Page({
  templateUrl: 'build/pages/tastings/tastings.html'
})
export class TastingsPage {
    static get parameters() {
        return [[NavController], [TastingsData], [Events]];
    }

    constructor(nav, tastingsData, events) {
        this.nav = nav;
        this.tastingsData = tastingsData;
        this.events = events;

        this.tastings = [];
        this.loadTastings();

        this.events.subscribe('tasting:saved', () => {
            this.loadTastings();
        });
    }

    loadTastings() {
        this.tastingsData.getTastings().then(data => {
           this.tastings = data;
        });
    }

    viewTasting(tasting) {
        this.nav.push(TastingPage, { tasting: tasting, isEdit: true });
    }

    createTasting() {
        // Beta Time !
        if(this.tastings.lenght === 10) {
            return;
        }

        this.nav.push(TastingPage, { tasting: null, isEdit: false });
    }
}
