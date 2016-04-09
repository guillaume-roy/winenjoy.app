import fs = require("file-system");
import platformModule = require("platform");
import {CriteriaItem} from "../entities/criteriaItem";
import _ = require("lodash");
import appSettings = require("application-settings");

export class WineDataService {
    private static DEFAULT_LANGUAGE = "fr";
    private static ENABLE_CACHE = false;

    public getCriterias(name: string): Promise<CriteriaItem[]> {
        return new Promise<CriteriaItem[]>((resolve, reject) => {
            let existsInCache = appSettings.hasKey(name);

            if (existsInCache && WineDataService.ENABLE_CACHE) {
                resolve(<CriteriaItem[]>JSON.parse(appSettings.getString(name)));
            } else {
                fs.File.fromPath(fs.path.join(fs.knownFolders.currentApp().path, "data", name + ".json")).readText()
                .then(fileContent => {
                    let criterias = this.internalLoadCriterias(fileContent);

                    if (WineDataService.ENABLE_CACHE) {
                        appSettings.setString(name, JSON.stringify(criterias));
                    }

                    resolve(criterias);
                }).catch(error => reject(error));
            }
        });
    }

    public getGeoAreas(): Promise<CriteriaItem[]> {
        return new Promise<CriteriaItem[]>((resolve, reject) => {
            this.getCriterias("geo").then(geoData => {
                resolve(geoData.map(g => <CriteriaItem>{
                    code: g.code,
                    id: g.id,
                    label: g.label
                }));
            });
        });
    }

    public getCountries(areaCode: string): Promise<CriteriaItem[]> {
        return new Promise<CriteriaItem[]>((resolve, reject) => {
            this.getCriterias("geo").then(geoData => {
                resolve(_.find(geoData, { code: areaCode }).values);
            });
        });
    }

    private internalLoadCriterias(fileContent: string) {
        let jsonFile = <[]>JSON.parse(fileContent);
        let platformData = _.find(jsonFile, (value: any) => {
           return value.language ===  platformModule.device.language;
        });

        let result: any;
        if (platformData) {
            result = platformData.data;
        } else {
            result = _.find(jsonFile, (value: any) => {
                return value.language ===  WineDataService.DEFAULT_LANGUAGE;
            }).data;
        }
        return _.orderBy(result, ["order", "label"]);
    }
}