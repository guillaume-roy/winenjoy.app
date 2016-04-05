import fs = require("file-system");
import platformModule = require("platform");
import {CriteriaItem} from "../entities/criteriaItem";
import _ = require("lodash");
import appSettings = require("application-settings");

export class WineDataService {
    private static DEFAULT_LANGUAGE = "fr";

    public getCriterias(name: string): Promise<CriteriaItem[]> {
        return new Promise<CriteriaItem[]>((resolve, reject) => {
            let existsInCache = appSettings.hasKey(name);

            if (existsInCache) {
                resolve(<CriteriaItem[]>JSON.parse(appSettings.getString(name)));
            } else {
                fs.File.fromPath(fs.path.join(fs.knownFolders.currentApp().path, "data", name + ".json")).readText()
                .then(fileContent => {
                    let criterias = this.internalLoadCriterias(fileContent);
                    appSettings.setString(name, JSON.stringify(criterias));
                    resolve(criterias);
                }).catch(error => reject(error));
            }
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