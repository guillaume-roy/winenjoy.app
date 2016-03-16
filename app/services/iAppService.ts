import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";

export interface IAppService {
    getWineTastings(): WineTasting[];
    getWineTypes(): CriteriaItem[];
    getYears(): number[];
    getLimpidityCriterias(): CriteriaItem[];
    getShineCriterias(): CriteriaItem[];
    getTearCriterias(): CriteriaItem[];
    getAromaCriterias(): CriteriaItem[];
    getBubbleCriterias(): CriteriaItem[];
    getIntensityCriterias(): CriteriaItem[];
    getLengthCriterias(): CriteriaItem[];
    getAttackCriterias(wineCode: string): CriteriaItem[];
    getTannicCriterias(): CriteriaItem[];
    getWhiteAcidityCriterias(): CriteriaItem[];

    saveWineTasting(wineTasting: WineTasting);
    deleteWineTasting(wineTasting: WineTasting);

    getWineTypesAsync(): Promise<CriteriaItem[]>;
    getYearsAsync(): Promise<number[]>;
    getLimpidityCriteriasAsync(): Promise<CriteriaItem[]>;
    getShineCriteriasAsync(): Promise<CriteriaItem[]>;
    getTearCriteriasAsync(): Promise<CriteriaItem[]>;
    getAromaCriteriasAsync(): Promise<CriteriaItem[]>;
    getBubbleCriteriasAsync(): Promise<CriteriaItem[]>;
    getIntensityCriteriasAsync(): Promise<CriteriaItem[]>;
    getLengthCriteriasAsync(): Promise<CriteriaItem[]>;
    getAttackCriteriasAsync(wineCode: string): Promise<CriteriaItem[]>;
    getTannicCriteriasAsync(): Promise<CriteriaItem[]>;
    getWhiteAcidityCriteriasAsync(): Promise<CriteriaItem[]>;
}
