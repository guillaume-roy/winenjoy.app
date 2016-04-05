import {WineTasting} from "../entities/wineTasting";
import appSettings = require("application-settings");
import {UUID} from "../utils/uuid";

export class TastingsService {
    private static TASTINGS_KEY = "TASTINGS";

    public getTastings(): Promise<WineTasting[]> {
        return new Promise<WineTasting[]>((resolve, reject) => {
            resolve(<WineTasting[]>JSON.parse(appSettings.getString(TastingsService.TASTINGS_KEY, "[]")));
        });
    }

    public saveTasting(wineTasting: WineTasting) {
        this.getTastings().then(wineTastings => {
            wineTasting.id = UUID.generate();
            wineTastings.push(wineTasting);
            this.saveTastings(wineTastings);
        });
    }

    public deleteTasting(wineTasting: WineTasting) {
        this.getTastings().then(wineTastings => {
            let savedTasting = wineTastings.filter(w => w.id === wineTasting.id);
            if (savedTasting && savedTasting.length > 0) {
                let wineTastingIndex = wineTastings.indexOf(savedTasting[0]);
                wineTastings.splice(wineTastingIndex, 1);
                this.saveTastings(wineTastings);
            }
        });
    }

    private saveTastings(wineTastings: WineTasting[]) {
        appSettings.setString(TastingsService.TASTINGS_KEY, JSON.stringify(wineTastings));
    }
}
