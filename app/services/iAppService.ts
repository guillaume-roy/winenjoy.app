import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";

export interface IAppService {
    getWineTastings(): WineTasting[];
    getWineTypes(): CriteriaItem[];
    getYears(): number[];
    getLimpidityCriterias(): CriteriaItem[];
    getIntensityCriterias(): CriteriaItem[];
    getTearCriterias(): CriteriaItem[];
    getBubbleCriterias(): CriteriaItem[];
}
