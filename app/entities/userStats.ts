export interface UserStats {
  uid?: string;
  totalTastings?: number;
  totalRatings?: number;
  averageRating?: number;

  tastingsByWineType?: Array<{ key: any, tastings: string[] }>;
  tastingsByRating?: Array<{ key: any, tastings: string[] }>;
  tastingsByEstate?: Array<{ key: any, tastings: string[] }>;
  tastingsByRegion?: Array<{ key: any, tastings: string[] }>;
  tastingsByCuvee?: Array<{ key: any, tastings: string[] }>;
  tastingsByCountry?: Array<{ key: any, tastings: string[] }>;
  tastingsByAoc?: Array<{ key: any, tastings: string[] }>;
  tastingsByWineYear?: Array<{ key: any, tastings: string[] }>;
  tastingsByIsBiological?: Array<{ key: any, tastings: string[] }>;
  tastingsByIsBiodynamic?: Array<{ key: any, tastings: string[] }>;
  tastingsByIsBlind?: Array<{ key: any, tastings: string[] }>;
  tastingsByGrape?: Array<{ key: any, tastings: string[] }>;
  tastingsByAromas?: Array<{ key: any, tastings: string[] }>;
  tastingsByAromaDefects?: Array<{ key: any, tastings: string[] }>;
  tastingsByBubbles?: Array<{ key: any, tastings: string[] }>;
  tastingsByFlavors?: Array<{ key: any, tastings: string[] }>;
  tastingsByFlavorDefects?: Array<{ key: any, tastings: string[] }>;
  tastingsByTastingYear?: Array<{ key: any, tastings: string[] }>;
}
