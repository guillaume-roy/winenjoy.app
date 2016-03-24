import {Page, NavParams, Modal, NavController} from 'ionic-angular';
import {WineData} from '../../providers/wine-data';
import * as _ from 'lodash';
import {ColorsModal} from '../colors-modal/colors-modal';

@Page({
  templateUrl: 'build/pages/tasting/sight-tab.html'
})
export class SightTab {
    static get parameters() {
        return [[WineData], [NavParams], [NavController]];
    }

    constructor(wineData, navParams, nav) {
        this.nav = nav;
        this.wineData = wineData;
        this.navParams = navParams;

        this.tasting = this.navParams.get('tasting');
        this.saveTasting = this.navParams.get('onSave');

        this.limpidities = [];
        this.shines = [];
        this.tears = [];
        this.bubbles = [];

        this.wineData.load('limpidities').then(data => {
            this.limpidities = data;
        });
        this.wineData.load('shines').then(data => {
            this.shines = data;
        });
        this.wineData.load('tears').then(data => {
            this.tears = data;
        });
        this.wineData.load('bubbles').then(data => {
            this.bubbles = data;
        });
    }

    selectCriteria(criteria, property) {
        if(criteria.isSelected) {
            delete criteria.isSelected;
            _.remove(this.tasting.sight[property], criteria);
        } else {
            this.tasting.sight[property].push(_.clone(criteria));
            criteria.isSelected = true;
        }
    }

    selectColor() {
        var colorsModal = Modal.create(ColorsModal, { wineType: this.tasting.informations.wineType });
        colorsModal.onDismiss(data => {
            this.tasting.sight.color = data;
        });
        this.nav.present(colorsModal);
    }
}
