import {CriteriaItem} from "./criteriaItem";

export interface WineTasting {
    id?: string;
    estate?: string;
    region?: string;
    cuvee?: string;
    country?: CriteriaItem;
    year?: number;
    wineType?: CriteriaItem;
    alcohol?: number;
    isBiologic?: boolean;
    isBiodynamic?: boolean;
    grapes?: CriteriaItem[];
    wineTabNotes?: string;
    startDate?: number;
    endDate?: number;
    synthesisTabNotes?: string;
    color?: string;
    finalRating?: string;
    sightTabNotes?: string;
    smellTabNotes?: string;
    tasteTabNotes?: string;
    aromas?: CriteriaItem[];
    defects?: CriteriaItem[];
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
}
