import fs = require("file-system");
import {CriteriaItem} from "../entities/criteriaItem";
import _ = require("lodash");

export class WineDataService {
    public getCriterias(name: string): Promise<CriteriaItem[]> {
        return new Promise<CriteriaItem[]>((resolve, reject) => {
            fs.File.fromPath(fs.path.join(fs.knownFolders.currentApp().path, "data", name + ".json")).readText()
            .then(fileContent => {
                let jsonFile = <[]>JSON.parse(fileContent);
                resolve(_.orderBy(jsonFile, ["order", "label"]));
            }).catch(error => reject(error));
        });
    }

}
