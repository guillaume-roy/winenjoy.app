import {Page, NavController} from 'ionic-angular';
import {TastingsData} from '../../providers/tastings-data';
import {InformationsTab} from './informations-tab';
import {SightTab} from './sight-tab';
import {SmellTab} from './smell-tab';
import {TasteTab} from './taste-tab';
import {SynthesisTab} from './synthesis-tab';

@Page({
  template: `
    <ion-tabs>
      <ion-tab tabTitle="Vin" [root]="informationsTab" [rootParams]="{ tasting: tasting, onSave: saveTasting }"></ion-tab>
      <ion-tab tabTitle="Aspect" [root]="sightTab" [rootParams]="{ tasting: tasting, onSave: saveTasting }"></ion-tab>
      <ion-tab tabTitle="Arômes" [root]="smellTab" [rootParams]="{ tasting: tasting, onSave: saveTasting }"></ion-tab>
      <ion-tab tabTitle="Saveurs" [root]="tasteTab" [rootParams]="{ tasting: tasting, onSave: saveTasting }"></ion-tab>
      <ion-tab tabTitle="Synthèse" [root]="synthesisTab" [rootParams]="{ tasting: tasting, onSave: saveTasting }"></ion-tab>
    </ion-tabs>`
})
export class TastingPage {
    static get parameters() {
        return [[NavController], [TastingsData]];
    }

    constructor(nav, tastingsData) {
        this.nav = nav;
        this.tastingsData = tastingsData;

        this.informationsTab = InformationsTab;
        this.sightTab = SightTab;
        this.smellTab = SmellTab;
        this.tasteTab = TasteTab;
        this.synthesisTab = SynthesisTab;

        this.tasting = {
            startDate: Date.now(),
            endDate: null,
            informations : {
                wineType: 'WHITE'
            },
            sight: {
                limpidities: [],
                shines: [],
                tears: [],
                bubbles: []
            },
            smell: {
                aromas: [],
                defects: [],
                intensities: []
            },
            taste: {
                attacks: [],
                balances: [],
                length: []
            },
            synthesis: {

            }
        };
    }

    saveTasting() {
        this.tasting.endDate = Date.now();
        console.log(this.tasting);
    }
}
