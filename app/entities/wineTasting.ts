import {CriteriaItem} from "./criteriaItem";

export interface WineTasting {
    id?: string;
    estate?: string;
    region?: CriteriaItem;
    name?: string;
    country?: CriteriaItem;
    aoc?: CriteriaItem;
    year?: number;
    wineType?: CriteriaItem;
    alcohol?: number;
    isBiodynamic?: boolean;
    isBlindTasting?: boolean;
    grapes?: CriteriaItem[];
    tastingDate?: number;
    color?: string;
    finalRating?: number;
    aromas?: CriteriaItem[];
    defects?: CriteriaItem[];
    winePotentials?: CriteriaItem[];
    flavors?: CriteriaItem[];
    flavorDefects?: CriteriaItem[];
    attacks?: CriteriaItem[];
    limpidities?: CriteriaItem[];
    shines?: CriteriaItem[];
    tears?: CriteriaItem[];
    hasBubbles?: boolean;
    hasDeposit?:boolean;
    noseIntensities?: CriteriaItem[];
    tasteIntensities?: CriteriaItem[];
    noseDevelopments?: CriteriaItem[];
    tannins?: CriteriaItem[];
    acidities?: CriteriaItem[];
    length?: CriteriaItem[];
    containsPicture?: boolean;
    winePairing?: string;
    comments?: string;
}
