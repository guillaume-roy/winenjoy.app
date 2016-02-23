export interface WineTasting {
    id: string;
    name: string;
    estate: string;
    region: string;
    cuvee: string;
    country: string;
    year: number;
    wineType: number;
    alcohol: number;
    isBiologic: boolean;
    isBiodynamic: boolean;
    grapes: string[];
    wineTabNotes: string;
}
