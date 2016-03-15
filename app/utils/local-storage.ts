import fs = require("file-system");
import platformModule = require("platform");
import {CriteriaItem} from "../entities/criteriaItem";
import _ = require("lodash");
import appSettings = require("application-settings");

export class LocalStorage {
    private _defaultLanguage = "fr";

    public loadCriteriasAsync(criteriasName: string): Promise<CriteriaItem[]> {
        let existsInCache = appSettings.hasKey(criteriasName);

        if (existsInCache) {
            return new Promise<CriteriaItem[]>((resolve, reject) => {
               resolve(<CriteriaItem[]>JSON.parse(appSettings.getString(criteriasName)));
            });
        } else {
            return new Promise<CriteriaItem[]>((resolve, reject) => {
                this.loadFile("data/" + criteriasName + ".json").readText()
                .then(fileContent => {
                    let criterias = this.internalLoadCriterias(fileContent);
                    appSettings.setString(criteriasName, JSON.stringify(criterias));
                    resolve(criterias);
                }).catch(error => reject(error));
            });
        }
    }

    public loadCriterias(criteriasName: string): CriteriaItem[] {
        let existsInCache = appSettings.hasKey(criteriasName);

        if (existsInCache) {
            return <CriteriaItem[]>JSON.parse(appSettings.getString(criteriasName));
        } else {
            let fileContent = this.loadFile("data/" + criteriasName + ".json").readTextSync();
            let criterias = this.internalLoadCriterias(fileContent);
            appSettings.setString(criteriasName, JSON.stringify(criterias));
            return criterias;
        }
    }

    private internalLoadCriterias(fileContent: string) {
        let jsonFile = <[]>JSON.parse(fileContent);
        let platformLanguage = platformModule.device.language;
        let platformData = _.find(jsonFile, (value: any) => {
           return value.language ===  platformLanguage;
        });

        let result: any;
        if (platformData) {
            result = platformData.data;
        } else {
            result = _.find(jsonFile, (value: any) => {
                return value.language ===  this._defaultLanguage;
            }).data;
        }
        return _.orderBy(result, ["order", "label"]);
    }

    private loadFile(filename: string) {
        let filePath = fs.path.join(fs.knownFolders.currentApp().path, filename);

        if (!fs.File.exists(filePath)) {
            return;
        }

        let file = fs.File.fromPath(filePath);
        if (!file) {
            return null;
        }

        return file;
    }
}
