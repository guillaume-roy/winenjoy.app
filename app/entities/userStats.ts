export interface UserStats {
  uid?: string;
  totalTastings?: number;
  totalRatings?: number;
  averageRating?: number;

tastingsByWineType?: { [id: string]: string[] };
tastingsByRating?: { [id: string]: string[] };
tastingsByEstate?: { [id: string]: string[] };
tastingsByRegion?: { [id: string]: string[] };
tastingsByCuvee?: { [id: string]: string[] };
tastingsByCountry?: { [id: string]: string[] };
tastingsByAoc?: { [id: string]: string[] };
tastingsByWineYear?: { [id: string]: string[] };
tastingsByIsBiological?: { [id: string]: string[] };
tastingsByIsBiodynamic?: { [id: string]: string[] };
tastingsByIsBlind?: { [id: string]: string[] };
tastingsByGrape?: { [id: string]: string[] };
tastingsByAromas?: { [id: string]: string[] };
tastingsByAromaDefects?: { [id: string]: string[] };
tastingsByBubbles?: { [id: string]: string[] };
tastingsByFlavors?: { [id: string]: string[] };
tastingsByFlavorDefects?: { [id: string]: string[] };
tastingsByTastingYear?: { [id: string]: string[] };
}
