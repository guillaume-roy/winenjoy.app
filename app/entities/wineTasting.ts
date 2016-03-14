import {CriteriaItem} from "./criteriaItem";

export interface WineTasting {
    id?: string;
    estate?: string;
    region?: string;
    cuvee?: string;
    country?: string;
    year?: number;
    wineType?: CriteriaItem;
    alcohol?: number;
    isBiologic?: boolean;
    isBiodynamic?: boolean;
    grapes?: string[];
    wineTabNotes?: string;
    startDate?: number;
    endDate?: number;
    synthesisTabNotes?: string;
    color?: string;
    finalRating?: string;
    sightTabNotes?: string;
    smellTabNotes?: string;
    aromas?: CriteriaItem[];
    defects?: CriteriaItem[];
    attacks?: CriteriaItem[];
}
