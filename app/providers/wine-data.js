import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import * as _ from 'lodash';

@Injectable()
export class WineData {
  static get parameters(){
    return [[Http]];
  }

  constructor(http) {
    this.http = http;
    this.DEFAULT_LANGUAGE = "fr";
  }

  load(name) {
    return new Promise(resolve => {
      this.http.get('data/' + name + '.json').subscribe(res => {
          var data = this.extractData(res.json());
          resolve(data);
      });
    });
  }

  loadAromas(isDefects) {
      return new Promise(resolve => {
        this.load('aromas').then(data => {
            let filterFunction = isDefects
                ? (d) => d.code === "DEFECTS"
                : (d) => d.code !== "DEFECTS";

            resolve(_.orderBy(_.flattenDeep(
                data.filter(filterFunction).map(a => {
                    return a.values.map(i => {
                        return i;
                    });
                })
            ), ["label"]));
        });
      });
  }

  extractData(rawData) {
    var platformLanguage = 'en';
    var platformData = _.find(rawData, value => {
        return value.language === platformLanguage;
    });

    var result;
    if (platformData) {
        result = platformData.data;
    } else {
        result = _.find(rawData, value => {
            return value.language ===  this.DEFAULT_LANGUAGE;
        }).data;
    }
    return _.orderBy(result, ["order", "label"]);
  }
}