import {WineTasting} from "../entities/wineTasting";
import appSettings = require("application-settings");
import {UUID} from "../utils/uuid";
import _ = require("lodash");

export class TastingsService {
    private static TASTINGS_KEY = "TASTINGS";

    public newTasting() {
        return <WineTasting>{
                alcohol: null,
                altitude: null,
                aoc: null,
                aromas: [],
                attacks: [],
                balances: [],
                bubbles: [],
                color: null,
                country: null,
                cuvee: null,
                defects: [],
                endDate: null,
                estate: null,
                finalRating: 2,
                grapes: [],
                id: null,
                intensities: [],
                isBiodynamic: false,
                isBiologic: false,
                isBlindTasting: false,
                lastModificationDate: null,
                latitude: null,
                length: [],
                limpidities: [],
                longitude: null,
                meatsNotes: null,
                picture: null,
                region: null,
                shines: [],
                sightTabNotes: null,
                smellTabNotes: null,
                startDate: Date.now(),
                synthesisTabNotes: null,
                tasteTabNotes: null,
                tears: [],
                wineTabNotes: null,
                wineType: null,
                year: null
            };
    }

    public getTastings(): Promise<WineTasting[]> {
        return new Promise<WineTasting[]>((resolve, reject) => {
            resolve(_.orderBy(<WineTasting[]>JSON.parse(appSettings.getString(TastingsService.TASTINGS_KEY, "[]")), ["endDate"], ["desc"]));
        });
    }

    public saveTasting(wineTasting: WineTasting): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getTastings().then(wineTastings => {
                if (_.isEmpty(wineTasting.id)) {
                    wineTasting.id = UUID.generate();
                    wineTasting.endDate = Date.now();
                    wineTastings.push(wineTasting);
                    this.saveTastings(wineTastings);
                    resolve(true);
                } else {
                    this.deleteTasting(wineTasting).then(result => {
                        this.getTastings().then(tastings => {
                            wineTasting.lastModificationDate = Date.now();
                            tastings.push(wineTasting);
                            this.saveTastings(tastings);
                            resolve(true);
                        });
                    });
                }
            });
        });
    }

    public deleteTasting(wineTasting: WineTasting): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getTastings().then(wineTastings => {
                _.remove(wineTastings, w => w.id === wineTasting.id);
                this.saveTastings(wineTastings);
                resolve(true);
            });
        });
    }

    public saveTastings(wineTastings: WineTasting[]) {
        appSettings.setString(TastingsService.TASTINGS_KEY, JSON.stringify(wineTastings));
    }
}
