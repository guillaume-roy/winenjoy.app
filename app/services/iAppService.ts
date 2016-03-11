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
    getSmellIntensityCriterias(): CriteriaItem[];

    getWineTypesAsync(): Promise<CriteriaItem[]>;
    getYearsAsync(): Promise<number[]>;
    getLimpidityCriteriasAsync(): Promise<CriteriaItem[]>;
    getShineCriteriasAsync(): Promise<CriteriaItem[]>;
    getTearCriteriasAsync(): Promise<CriteriaItem[]>;
    getAromaCriteriasAsync(): Promise<CriteriaItem[]>;
    getBubbleCriteriasAsync(): Promise<CriteriaItem[]>;
    getSmellIntensityCriteriasAsync(): Promise<CriteriaItem[]>;
}
