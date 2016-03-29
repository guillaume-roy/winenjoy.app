import {Injectable} from 'angular2/core';
import {Storage, SqlStorage} from 'ionic-angular';
import * as _ from 'lodash';

@Injectable()
export class TastingsData {
  constructor() {
    this.storage = new Storage(SqlStorage, { name: "winenjoy" });
    this.TASTINGS_KEY = "TASTINGS";
  }

  getTastings() {
      return new Promise((resolve, reject) => {
         this.storage.get(this.TASTINGS_KEY).then(data => {
            var tastings = null;
            if(!data) {
                tastings = [];
            } else {
                tastings = JSON.parse(data);
            }
            resolve(_.orderBy(tastings, ['endDate'], ['desc']));
        });
      });
  }

  saveTasting(tasting) {
      return new Promise((resolve, reject) => {
          if(tasting.id) {
              this.getTastings().then(tastings => {
                _.remove(tastings, t => t.id === tasting.id);
                tastings.push(tasting);
                this.storage.set(this.TASTINGS_KEY, JSON.stringify(tastings));
                resolve(true);
            });
          } else {
            tasting.id = this.generateUUID();
            this.getTastings().then(tastings => {
                tastings.push(tasting);
                this.storage.set(this.TASTINGS_KEY, JSON.stringify(tastings));
                resolve(true);
            });
          }
      });
  }

  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  }
}

/*

export interface WineTasting {
    longitude?: number;
    latitude?: number;
    altitude?: number;
}

*/