import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";

export interface IAppService {
    getWineTastings(): WineTasting[];
    getWineTypes(): CriteriaItem[];
    getYears(): number[];
    getLimpidityCriterias(): CriteriaItem[];
    getSightIntensityCriterias(): CriteriaItem[];
    getTearCriterias(): CriteriaItem[];
    getAromaCriterias(): CriteriaItem[];
    getBubbleCriterias(): CriteriaItem[];
    getSmellIntensityCriterias(): CriteriaItem[];
}
