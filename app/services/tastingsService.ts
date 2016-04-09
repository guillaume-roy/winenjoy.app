import {WineTasting} from "../entities/wineTasting";
import appSettings = require("application-settings");
import {UUID} from "../utils/uuid";
import _ = require("lodash");

export class TastingsService {
    private static TASTINGS_KEY = "TASTINGS";

    public getTastings(): Promise<WineTasting[]> {
        return new Promise<WineTasting[]>((resolve, reject) => {
            resolve(<WineTasting[]>JSON.parse(appSettings.getString(TastingsService.TASTINGS_KEY, "[]")));
        });
    }

    public saveTasting(wineTasting: WineTasting) {
        this.getTastings().then(wineTastings => {
            if (_.isEmpty(wineTasting.id)) {
                wineTasting.id = UUID.generate();
                wineTastings.push(wineTasting);
                this.saveTastings(wineTastings);
            } else {
                this.deleteTasting(wineTasting).then(result => {
                    this.getTastings().then(tastings => {
                        tastings.push(wineTasting);
                        this.saveTastings(tastings);
                    });
                });
            }
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

    private saveTastings(wineTastings: WineTasting[]) {
        console.dump(wineTastings);
        appSettings.setString(TastingsService.TASTINGS_KEY, JSON.stringify(wineTastings));
    }
}
