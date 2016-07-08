import {CriteriaItem} from "./criteriaItem";

export interface WineTasting {
    id?: string;
    estate?: string;
    region?: CriteriaItem;
    cuvee?: string;
    country?: CriteriaItem;
    aoc?: CriteriaItem;
    year?: number;
    wineType?: CriteriaItem;
    alcohol?: number;
    isBiologic?: boolean;
    isBiodynamic?: boolean;
    isBlindTasting?: boolean;
    grapes?: CriteriaItem[];
    wineTabNotes?: string;
    startDate?: number;
    endDate?: number;
    lastModificationDate?: number;
    synthesisTabNotes?: string;
    color?: string;
    finalRating?: number;
    sightTabNotes?: string;
    smellTabNotes?: string;
    tasteTabNotes?: string;
    aromas?: CriteriaItem[];
    aromaDefects?: CriteriaItem[];
    flavors?: CriteriaItem[];
    flavorDefects?: CriteriaItem[];
    attacks?: CriteriaItem[];
    limpidities?: CriteriaItem[];
    shines?: CriteriaItem[];
    tears?: CriteriaItem[];
    bubbles?: CriteriaItem[];
    intensities?: CriteriaItem[];
    balances?: CriteriaItem[];
    length?: CriteriaItem[];
    meatsNotes?: string;
    longitude?: number;
    latitude?: number;
    altitude?: number;
    picture?: string;
}
