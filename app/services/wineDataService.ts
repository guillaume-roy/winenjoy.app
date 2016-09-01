import {CriteriaItem} from "../entities/criteriaItem";
import _ = require("lodash");

export class WineDataService {
    private get wineCriterias() {
        return global.wineCriterias;
    }
    private set wineCriterias(value) {
        global.wineCriterias = value;
    }

    private loadData() {
        var data = require("../data/wine-criterias.json");
        this.wineCriterias = data;
    }
    
    public getCriterias(type: string): Promise<CriteriaItem[]> {
        return new Promise<CriteriaItem[]>((resolve, reject) => {
            if (_.isEmpty(this.wineCriterias)) {
                this.loadData();
            }
            resolve(this.wineCriterias[type]);
        });
    }
}