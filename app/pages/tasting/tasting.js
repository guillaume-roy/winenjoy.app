import {Page, NavController, Alert, Events, NavParams} from 'ionic-angular';
import {TastingsData} from '../../providers/tastings-data';
import {InformationsTab} from './informations-tab';
import {SightTab} from './sight-tab';
import {SmellTab} from './smell-tab';
import {TasteTab} from './taste-tab';
import {SynthesisTab} from './synthesis-tab';

@Page({
  template: `
    <ion-tabs [selectedIndex]="selectedTab">
      <ion-tab tabTitle="Vin" [root]="informationsTab" [rootParams]="{ tasting: tasting, onSave: saveTasting, onCancel: cancelTasting }"></ion-tab>
      <ion-tab tabTitle="Aspect" [root]="sightTab" [rootParams]="{ tasting: tasting, onSave: saveTasting, onCancel: cancelTasting }"></ion-tab>
      <ion-tab tabTitle="Arômes" [root]="smellTab" [rootParams]="{ tasting: tasting, onSave: saveTasting, onCancel: cancelTasting }"></ion-tab>
      <ion-tab tabTitle="Saveurs" [root]="tasteTab" [rootParams]="{ tasting: tasting, onSave: saveTasting, onCancel: cancelTasting }"></ion-tab>
      <ion-tab tabTitle="Synthèse" [root]="synthesisTab" [rootParams]="{ tasting: tasting, onSave: saveTasting, onCancel: cancelTasting }"></ion-tab>
    </ion-tabs>`
})
export class TastingPage {
    static get parameters() {
        return [[NavController], [TastingsData], [Events], [NavParams]];
    }

    constructor(nav, tastingsData, events, navParams) {
        this.nav = nav;
        this.tastingsData = tastingsData;
        this.events = events;
        this.navParams = navParams;

        this.informationsTab = InformationsTab;
        this.sightTab = SightTab;
        this.smellTab = SmellTab;
        this.tasteTab = TasteTab;
        this.synthesisTab = SynthesisTab;

        this.selectedTab = 0;

        this.tasting = this.navParams.get('tasting') || {
            id: null,
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
                rating: 'NEUTRAL'
            }
        };

        this.events.subscribe('tasting:save', () => {
            this.saveTasting();
        });
        this.events.subscribe('tasting:cancel', () => {
            this.cancelTasting();
        });
    }

    saveTasting() {
        if(!this.tasting.informations.cuvee) {
            let confirm = Alert.create({
                title: 'Erreur',
                message: 'La cuvée est obligatoire.',
                buttons: ['OK']
            });
            this.nav.present(confirm);
            this.selectedTab = 0;
            return;
        }

        this.tasting.endDate = Date.now();
        this.tastingsData.saveTasting(this.tasting).then(result => {
            if(result) {
                this.events.publish('tasting:saved');
                this.nav.pop();
            }
        });
    }

    cancelTasting() {
        let confirm = Alert.create({
            title: 'Annuler',
            message: 'Etes-vous sûr de vouloir annuler cette dégustation ?',
            buttons: [
                {
                    text: 'Non',
                    role: 'cancel'
                },
                {
                    text: 'Oui',
                    handler: () => {
                        setTimeout(() => this.nav.pop(), 500);
                    }
                }
            ]
        });
        this.nav.present(confirm);
    }
}
