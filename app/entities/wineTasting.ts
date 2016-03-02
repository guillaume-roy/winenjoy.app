export interface WineTasting {
    id?: string;
    estate?: string;
    region?: string;
    aoc?: string;
    cuvee?: string;
    country?: string;
    year?: number;
    wineType?: number;
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
}
