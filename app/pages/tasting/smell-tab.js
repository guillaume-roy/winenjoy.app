import {Page, NavParams, Modal, NavController} from 'ionic-angular';
import {WineData} from '../../providers/wine-data';
import * as _ from 'lodash';
import {AromasModal} from '../aromas-modal/aromas-modal';

@Page({
  templateUrl: 'build/pages/tasting/smell-tab.html'
})
export class SmellTab {
    static get parameters() {
        return [[WineData], [NavParams], [NavController]];
    }

    constructor(wineData, navParams, nav) {
        this.nav = nav;
        this.wineData = wineData;
        this.navParams = navParams;

        this.tasting = this.navParams.get('tasting');
        this.saveTasting = this.navParams.get('onSave');

        this.intensities = [];

        this.wineData.load('intensities').then(data => {
            this.intensities = data;
        });
    }

    selectCriteria(criteria, property) {
        if(criteria.isSelected) {
            delete criteria.isSelected;
            _.remove(this.tasting.smell[property], criteria);
        } else {
            this.tasting.smell[property].push(_.clone(criteria));
            criteria.isSelected = true;
        }
    }

    selectAromas() {
        var aromasModal = Modal.create(AromasModal, { selectedValues: this.tasting.smell.aromas, isDefects: false });
        aromasModal.onDismiss(data => {
            this.tasting.smell.aromas = data;
        });
        this.nav.present(aromasModal);
    }

    selectDefects() {
        var aromasModal = Modal.create(AromasModal, { selectedValues: this.tasting.smell.defects, isDefects: true });
        aromasModal.onDismiss(data => {
            this.tasting.smell.defects = data;
        });
        this.nav.present(aromasModal);
    }
}
