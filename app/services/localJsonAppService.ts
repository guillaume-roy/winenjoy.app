import fs = require("file-system");
import platformModule = require("platform");
import {IAppService} from "./iAppService";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";

export class LocalJsonAppService implements IAppService {
    private _defaultLanguage = "fr";

    public getWineTastings(): WineTasting[] {
        return [];
    }

    public getYears(): number[] {
        let result = [];
        let currentYear = new Date().getFullYear();
        for (let i = 1900; i <= currentYear; i++) {
            result.push(i);
        }
        return result;
    }

    public getYearsAsync(): Promise<number[]> {
        return new Promise<number[]>((resolve, reject) => {
            let result = [];
            let currentYear = new Date().getFullYear();
            for (let i = 1900; i <= currentYear; i++) {
                result.push(i);
            }
            resolve(result);
        });
    }

    public getIntensityCriterias(): CriteriaItem[] {
        return this.loadJSON("intensities");
    }

    public getIntensityCriteriasAsync(): Promise<CriteriaItem[]> {
        return this.loadJsonAsync("intensities");
    }

    public getAromaCriterias(): CriteriaItem[] {
        return this.loadJSON("aromas");
    }

    public getAromaCriteriasAsync(): Promise<CriteriaItem[]> {
        return this.loadJsonAsync("aromas");
    }

    public getWineTypes(): CriteriaItem[] {
        return this.loadJSON("wineTypes");
    }

    public getWineTypesAsync(): Promise<CriteriaItem[]> {
        return this.loadJsonAsync("wineTypes");
    }

    public getShineCriterias(): CriteriaItem[] {
        return this.loadJSON("shines");
    }

    public getShineCriteriasAsync(): Promise<CriteriaItem[]> {
        return this.loadJsonAsync("shines");
    }

    public getBubbleCriterias(): CriteriaItem[] {
        return this.loadJSON("bubbles");
    }

    public getBubbleCriteriasAsync(): Promise<CriteriaItem[]> {
        return this.loadJsonAsync("bubbles");
    }

    public getTearCriterias(): CriteriaItem[] {
        return this.loadJSON("tears");
    }

    public getTearCriteriasAsync(): Promise<CriteriaItem[]> {
        return this.loadJsonAsync("tears");
    }

    public getLimpidityCriterias(): CriteriaItem[] {
        return this.loadJSON("limpidities");
    }

    public getLimpidityCriteriasAsync(): Promise<CriteriaItem[]> {
        return this.loadJsonAsync("limpidities");
    }

    private loadJsonAsync(filename: string): Promise<CriteriaItem[]> {
        return new Promise<CriteriaItem[]>((resolve, reject) => {
            let filePath = fs.path.join(fs.knownFolders.currentApp().path, "data", filename + ".json");
            let file = fs.File.fromPath(filePath);
            file.readText()
            .then(fileContent => {
                let jsonFile = <[]>JSON.parse(fileContent);

                let platformData = <any>jsonFile.filter((value: any) => {
                    return value.language ===  platformModule.device.language;
                });

                if (platformData && platformData.length > 0) {
                    resolve(<CriteriaItem[]>platformData[0].data);
                } else {
                    resolve(<CriteriaItem[]>(<any>jsonFile.filter((value: any) => {
                        return value.language === this._defaultLanguage;
                    })[0]).data);
                }
            }).catch(error => reject(error));
        });
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

        let platformData = <any>jsonFile.filter((value: any) => {
           return value.language ===  platformLanguage;
        });

        if (platformData && platformData.length > 0) {
            return platformData[0].data;
        } else {
            return (<any>jsonFile.filter((value: any) => {
                return value.language === this._defaultLanguage;
            })[0]).data;
        }
    }
}
