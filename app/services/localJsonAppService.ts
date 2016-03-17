import {IAppService} from "./iAppService";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";
import {LocalStorage} from "../utils/local-storage";
import appSettings = require("application-settings");
import {UUID} from "../utils/uuid";
import {UserInformations} from "../entities/userInformations";

export class LocalJsonAppService implements IAppService {
    private _localStorage: LocalStorage;
    private _wineTastingsCollectionName = "wineTastings";

    constructor() {
        this._localStorage = new LocalStorage();
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
        return this._localStorage.loadCriterias("intensities");
    }

    public getIntensityCriteriasAsync(): Promise<CriteriaItem[]> {
        return this._localStorage.loadCriteriasAsync("intensities");
    }

    public getAromaCriterias(): CriteriaItem[] {
        return this._localStorage.loadCriterias("aromas");
    }

    public getAromaCriteriasAsync(): Promise<CriteriaItem[]> {
        return this._localStorage.loadCriteriasAsync("aromas");
    }

    public getWineTypes(): CriteriaItem[] {
        return this._localStorage.loadCriterias("wineTypes");
    }

    public getWineTypesAsync(): Promise<CriteriaItem[]> {
        return this._localStorage.loadCriteriasAsync("wineTypes");
    }

    public getShineCriterias(): CriteriaItem[] {
        return this._localStorage.loadCriterias("shines");
    }

    public getShineCriteriasAsync(): Promise<CriteriaItem[]> {
        return this._localStorage.loadCriteriasAsync("shines");
    }

    public getBubbleCriterias(): CriteriaItem[] {
        return this._localStorage.loadCriterias("bubbles");
    }

    public getBubbleCriteriasAsync(): Promise<CriteriaItem[]> {
        return this._localStorage.loadCriteriasAsync("bubbles");
    }

    public getTearCriterias(): CriteriaItem[] {
        return this._localStorage.loadCriterias("tears");
    }

    public getTearCriteriasAsync(): Promise<CriteriaItem[]> {
        return this._localStorage.loadCriteriasAsync("tears");
    }

    public getLimpidityCriterias(): CriteriaItem[] {
        return this._localStorage.loadCriterias("limpidities");
    }

    public getLimpidityCriteriasAsync(): Promise<CriteriaItem[]> {
        return this._localStorage.loadCriteriasAsync("limpidities");
    }

    public getLengthCriterias(): CriteriaItem[] {
        return this._localStorage.loadCriterias("length");
    }

    public getLengthCriteriasAsync(): Promise<CriteriaItem[]> {
        return this._localStorage.loadCriteriasAsync("length");
    }

    public getTannicCriterias(): CriteriaItem[] {
        return this._localStorage.loadCriterias("red-tannics");
    }

    public getTannicCriteriasAsync(): Promise<CriteriaItem[]> {
        return this._localStorage.loadCriteriasAsync("red-tannics");
    }

    public getWhiteAcidityCriterias(): CriteriaItem[] {
        return this._localStorage.loadCriterias("white-acidities");
    }

    public getWhiteAcidityCriteriasAsync(): Promise<CriteriaItem[]> {
        return this._localStorage.loadCriteriasAsync("white-acidities");
    }

    public getAttackCriterias(wineCode: string): CriteriaItem[] {
        return this._localStorage.loadCriterias("attacks").filter(a => a.code === wineCode)[0].values;
    }

    public getAttackCriteriasAsync(wineCode: string): Promise<CriteriaItem[]> {
        return new Promise<CriteriaItem[]>((resolve, reject) => {
            this._localStorage.loadCriteriasAsync("attacks")
            .then(data => resolve(data.filter(a => a.code === wineCode)[0].values))
            .catch(e => reject(e));
        });
    }

    public getWineTastings(): WineTasting[] {
        return <WineTasting[]>JSON.parse(appSettings.getString(this._wineTastingsCollectionName, "[]"));
    }

    public saveWineTasting(wineTasting: WineTasting) {
        let wineTastings = this.getWineTastings();
        wineTasting.id = UUID.generate();
        wineTastings.push(wineTasting);
        appSettings.setString(this._wineTastingsCollectionName, JSON.stringify(wineTastings));
    }

    public deleteWineTasting(wineTasting: WineTasting) {
        let wineTastings = this.getWineTastings();
        let savedTasting = wineTastings.filter(w => w.id === wineTasting.id);
        if (savedTasting && savedTasting.length > 0) {
            let wineTastingIndex = wineTastings.indexOf(savedTasting[0]);
            wineTastings.splice(wineTastingIndex, 1);
            appSettings.setString(this._wineTastingsCollectionName, JSON.stringify(wineTastings));
        }
    }

    public getUserInformations(): UserInformations {
        return <UserInformations>JSON.parse(appSettings.getString("userInformations"));
    }

    public setUserInformations(value: UserInformations) {
        appSettings.setString("userInformations", JSON.stringify(value));
    }
}
