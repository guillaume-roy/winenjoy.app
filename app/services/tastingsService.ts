import {WineTasting} from "../entities/wineTasting";
import appSettings = require("application-settings");
import {UUID} from "../utils/uuid";
import _ = require("lodash");

export class TastingsService {
    private static TASTINGS_KEY = "TASTINGS";
    private static TASTING_KEY = "TASTING";

    public newTasting() {
        appSettings.setString(TastingsService.TASTING_KEY, JSON.stringify(
            <WineTasting>{
                aromas: [],
                attacks: [],
                balances: [],
                bubbles: [],
                country: null,
                defects: [],
                finalRating: "NEUTRAL",
                intensities: [],
                length: [],
                limpidities: [],
                shines: [],
                startDate: Date.now(),
                tears: []
            }));
    }

    public editTasting(wineTastingId: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getTastings().then(tastings => {
                this.storeTasting(_.find(tastings, { id: wineTastingId }));
                resolve(true);
            });
        });
    }

    public loadTasting(): WineTasting {
        return <WineTasting>JSON.parse(appSettings.getString(TastingsService.TASTING_KEY));
    }

    public storeTasting(wineTasting: WineTasting) {
        appSettings.setString(TastingsService.TASTING_KEY, JSON.stringify(wineTasting));
    }

    public getTastings(): Promise<WineTasting[]> {
        return new Promise<WineTasting[]>((resolve, reject) => {
            resolve(<WineTasting[]>JSON.parse(appSettings.getString(TastingsService.TASTINGS_KEY, "[]")));
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
                    appSettings.remove(TastingsService.TASTING_KEY);
                    resolve(true);
                } else {
                    this.deleteTasting(wineTasting).then(result => {
                        this.getTastings().then(tastings => {
                            wineTasting.lastModificationDate = Date.now();
                            tastings.push(wineTasting);
                            this.saveTastings(tastings);
                            appSettings.remove(TastingsService.TASTING_KEY);
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
                appSettings.remove(TastingsService.TASTING_KEY);
                resolve(true);
            });
        });
    }

    private saveTastings(wineTastings: WineTasting[]) {
        appSettings.setString(TastingsService.TASTINGS_KEY, JSON.stringify(wineTastings));
    }
}
