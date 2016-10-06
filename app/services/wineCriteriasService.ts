import {CriteriaItem} from "../entities/criteriaItem";
import _ = require("lodash");
import firebase = require("nativescript-plugin-firebase");

export class WineCriteriasService {
    private get wineCriterias() {
        return global.wineCriterias;
    }
    private set wineCriterias(value) {
        global.wineCriterias = value;
    }

    constructor() {
        if (_.isEmpty(this.wineCriterias)) {
            this.wineCriterias = {};
        }
    }

    getCriteriasFromFirebase(type: string, order?: string): Promise<CriteriaItem[]> {
        return new Promise<CriteriaItem[]>((resolve, reject) => {
            try {
                if (!_.isEmpty(this.wineCriterias[type])) {
                    resolve(this.wineCriterias[type]);
                } else {
                    firebase.query(
                        data => {
                            var res = data.value || [];
                            this.wineCriterias[type] = res;
                            resolve(res);
                        },
                        `/criterias/fr/${type}`,
                        {
                            orderBy: {
                                type: firebase.QueryOrderByType.CHILD,
                                value: order ? order : "order"
                            },
                            singleEvent: true
                        })
                        .catch(error => {
                            reject({
                                error: error,
                                message: "Error in WineCriteriasService.getCriteriasFromFirebase"
                            });
                        });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    getLocations(): Promise<CriteriaItem[]> {
        return new Promise<CriteriaItem[]>((resolve, reject) => {
            try {
                var res = [];
                this.getCriteriasFromFirebase("regions")
                    .then(regions => {
                        this.getCriteriasFromFirebase("countries")
                            .then(countries => {
                                this.getCriteriasFromFirebase("aoc")
                                    .then(aoc => {
                                        res = res
                                            .concat(regions.map(r => {
                                                var region = <CriteriaItem>_.assignIn({}, r);
                                                region.label = "Région : " + r.label;
                                                region.type = "region";
                                                return region;
                                            }))
                                            .concat(countries.map(r => {
                                                var country = <CriteriaItem>_.assignIn({}, r);
                                                country.label = "Pays : " + r.label;
                                                country.type = "country";
                                                return country;
                                            }))
                                            .concat(aoc.map(r => {
                                                var aoc = <CriteriaItem>_.assignIn({}, r);
                                                aoc.label = "AOC : " + r.label;
                                                aoc.type = "aoc";
                                                return aoc;
                                            }));
                                        resolve(res);
                                    }).catch(aocError => reject(aocError));
                            }).catch(countriesError => reject(countriesError));
                    })
                    .catch(regionsError => reject(regionsError));
            } catch (error) {
                reject({
                    error: error,
                    messgae: "Error in WineCriteriasService.getLocations"
                });
            }
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