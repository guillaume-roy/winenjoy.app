import fs = require("file-system");
import platformModule = require("platform");
import {IAppService} from "./iAppService";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";

export class LocalJsonAppService implements IAppService {
    public getWineTastings(): WineTasting[] {
        return [];
        // return this.deserialize<WineTasting>(this._wineTastingsCollectionName);
    }

    public getYears(): number[] {
        let result = [];
        let currentYear = new Date().getFullYear();
        for (let i = 1900; i <= currentYear; i++) {
            result.push(i);
        }
        return result;
    }

    public getSmellIntensityCriterias(): CriteriaItem[] {
        return this.loadJSON("smell-intensities");
    }

    public getAromaCriterias(): CriteriaItem[] {
        return this.loadJSON("aromas");
    }

    public getWineTypes(): CriteriaItem[] {
        return this.loadJSON("wineTypes");
    }

    public getSightIntensityCriterias(): CriteriaItem[] {
        return this.loadJSON("sight-intensities");
    }

    public getBubbleCriterias(): CriteriaItem[] {
        return this.loadJSON("bubbles");
    }

    public getTearCriterias(): CriteriaItem[] {
        return this.loadJSON("tears");
    }

    public getLimpidityCriterias(): CriteriaItem[] {
        return this.loadJSON("limpidities");
    }

    private loadJSON(filename: string): CriteriaItem[] {
        let filePath = fs.path.join(fs.knownFolders.currentApp().path, "data", filename + ".json");

        if (!fs.File.exists(filePath)) {
            return;
        }

        let file = fs.File.fromPath(filePath);
        if (!file) {
            return null;
        }

        let fileContent = file.readTextSync();
        if (!fileContent) {
            return null;
        }

        let jsonFile = <[]>JSON.parse(fileContent);

        let platformLanguage = platformModule.device.language;

        return <CriteriaItem[]>(<any>jsonFile.filter((value: any) => {
           return value.language ===  platformLanguage;
        })[0]).data;
    }
}
