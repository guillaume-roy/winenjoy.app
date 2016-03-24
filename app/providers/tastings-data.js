import {Injectable} from 'angular2/core';
import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class TastingsData {
  constructor() {
    this.storage = new Storage(LocalStorage);
  }

  getTastings() {
      return new Promise((resolve, reject) => {
          resolve([
            {
                id: "12",
                cuvee: "Grand Opéra",
                region: "Languedoc",
                country: "France",
                estate: "Rocbère",
                year: 2008,
                color: "#FFC107"
            }
        ]);
      });
  }
}

/*

export interface WineTasting {
    id?: string;
    estate?: string;
    region?: string;
    cuvee?: string;
    country?: string;
    year?: number;
    wineType?: CriteriaItem;
    alcohol?: number;
    isBiologic?: boolean;
    isBiodynamic?: boolean;
    grapes?: string[];
    wineTabNotes?: string;
    startDate?: number;
    endDate?: number;
    synthesisTabNotes?: string;
    color?: string;
    finalRating?: string;
    sightTabNotes?: string;
    smellTabNotes?: string;
    tasteTabNotes?: string;
    aromas?: CriteriaItem[];
    defects?: CriteriaItem[];
    attacks?: CriteriaItem[];
    limpidities?: CriteriaItem[];
    shines?: CriteriaItem[];
    tears?: CriteriaItem[];
    bubbles?: CriteriaItem[];
    intensities?: CriteriaItem[];
    balances?: CriteriaItem[];
    length?: CriteriaItem[];
    meatsNotes?: string;
    longitude?: number;
    latitude?: number;
    altitude?: number;
}

*/