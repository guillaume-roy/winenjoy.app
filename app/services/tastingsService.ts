import {WineTasting} from "../entities/wineTasting";
import appSettings = require("application-settings");
import {UUID} from "../utils/uuid";
import _ = require("lodash");
import {UserService} from "./userService";

export class TastingsService {
    private static TASTINGS_KEY = "TASTINGS";

    public newTasting() {
        return <WineTasting>{
                aromas: [],
                attacks: [],
                balances: [],
                bubbles: [],
                country: null,
                defects: [],
                finalRating: 2,
                intensities: [],
                length: [],
                limpidities: [],
                shines: [],
                startDate: Date.now(),
                tears: []
            };
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

                    let userService = new UserService();
                    wineTasting.userId = userService.getUser().firebaseUid;

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
