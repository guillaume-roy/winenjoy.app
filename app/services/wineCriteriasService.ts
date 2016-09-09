import {CriteriaItem} from "../entities/criteriaItem";
import _ = require("lodash");

export class WineCriteriasService {
    private get wineCriterias() {
        return global.wineCriterias;
    }
    private set wineCriterias(value) {
        global.wineCriterias = value;
    }

    private loadData() {
        if (_.isEmpty(this.wineCriterias)) {
            var data = require("../data/wine-criterias.json");
            this.wineCriterias = data;
        }
    }
    
    public getCriterias(type: string): Promise<CriteriaItem[]> {
        return new Promise<CriteriaItem[]>((resolve, reject) => {
            this.loadData();
            resolve(this.wineCriterias[type]);
        });
    }

    public getLocations(): Promise<CriteriaItem[]> {
        return new Promise<CriteriaItem[]>((resolve, reject) => {
            this.loadData();
            var regions = (<CriteriaItem[]>this.wineCriterias["regions"]).map(r => {
                r.label = "Région : " + r.label;
                r.type = "region";
                return r;
            });
            var countries = (<CriteriaItem[]>this.wineCriterias["countries"]).map(r => {
                r.label = "Pays : " + r.label;
                r.type = "country";
                return r;
            });
            var aoc = (<CriteriaItem[]>this.wineCriterias["aoc"]).map(r => {
                r.label = "AOC : " + r.label;
                r.type = "aoc";
                return r;
            });

            resolve((<CriteriaItem[]>[]).concat(regions, countries, aoc));
        });
    }
}