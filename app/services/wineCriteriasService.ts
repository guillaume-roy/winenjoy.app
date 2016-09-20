import {CriteriaItem} from "../entities/criteriaItem";
import _ = require("lodash");

export class WineCriteriasService {
    private get wineCriterias() {
        return global.wineCriterias;
    }
    private set wineCriterias(value) {
        global.wineCriterias = value;
    }

    public loadData() {
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
                var region = <CriteriaItem>_.assignIn({}, r);
                region.label = "Région : " + r.label;
                region.type = "region";
                return region;
            });
            var countries = (<CriteriaItem[]>this.wineCriterias["countries"]).map(r => {
                var country = <CriteriaItem>_.assignIn({}, r);
                country.label = "Pays : " + r.label;
                country.type = "country";
                return country;
            });
            var aoc = (<CriteriaItem[]>this.wineCriterias["aoc"]).map(r => {
                var aoc = <CriteriaItem>_.assignIn({}, r);
                aoc.label = "AOC : " + r.label;
                aoc.type = "aoc";
                return aoc;
            });

            resolve((<CriteriaItem[]>[]).concat(regions, countries, aoc));
        });
    }

    getAoc(id): CriteriaItem {
        return _.find(this.wineCriterias["aoc"], { id: id });
    }

    getRegion(id): CriteriaItem {
        return _.find(this.wineCriterias["regions"], { id: id });
    }

    getCountry(id): CriteriaItem {
        return _.find(this.wineCriterias["countries"], { id: id });
    }
}