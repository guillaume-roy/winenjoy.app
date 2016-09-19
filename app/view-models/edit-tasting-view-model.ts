import {Observable} from "data/observable";
import {WineCriteriasService} from "../services/wineCriteriasService";
import {WineTasting} from "../entities/wineTasting";
import {TastingsService} from "../services/tastingsService";
import fs = require("file-system");
import _ = require("lodash");

export class EditTastingViewModel extends Observable {
    private _wineCriteriasService: WineCriteriasService;
    private _rawAlcoolValue: number;
    private _selectedYearIndex: number;

    get selectedYearIndex() {
        return this._selectedYearIndex;
    }
    set selectedYearIndex(value) {
        this._selectedYearIndex = value;
        this.notifyPropertyChange("selectedYearIndex", value);

        this.set("selectedYear", this.get("years")[value]);
    }

    set rawAlcoolValue(value) {
        this._rawAlcoolValue = value;
        this.notifyPropertyChange("rawAlcoolValue", value);

        this.set("alcoolValue", (value / 10).toFixed(1));
    }
    get rawAlcoolValue() {
        return this._rawAlcoolValue;
    }

    constructor() {
        super();
        this._wineCriteriasService = new WineCriteriasService();
    }

    init() {
        this._wineCriteriasService.loadData();
        this.loadCriteria("limpidities");
        this.loadCriteria("shines");
        this.loadCriteria("tears");
        this.loadCriteria("intensities", "noseIntensities");
        this.loadCriteria("developments", "noseDevelopments");
        this.loadCriteria("attacks");
        this.loadCriteria("acidities");
        this.loadCriteria("tannins");
        this.loadCriteria("intensities", "tasteIntensities");
        this.loadCriteria("length");
        this.loadCriteria("developments", "winePotentials");
        this.loadCriteria("wineTypes");

        this.set("selectedWineType", 0);
        this.set("selectedAromas", []);
        this.set("selectedAromaDefects", []);
        this.set("selectedFlavors", []);
        this.set("selectedFlavorDefects", []);
        this.set("picture", null);
        this.set("selectedLimpidities", []);
        this.set("selectedWinePotentials", []);
        this.set("selectedLength", []);
        this.set("selectedTasteIntensities", []);
        this.set("selectedTannins", []);
        this.set("selectedAcidities", []);
        this.set("selectedAttacks", []);
        this.set("selectedNoseDevelopments", []);
        this.set("selectedNoseIntensities", []);
        this.set("selectedTears", []);
        this.set("selectedShines", []);
        this.set("selectedGrapes", []);
        this.set("tastingDate", new Date());
        this.set("finalRating", 2);

        var years = [];
        for (var i = new Date().getFullYear(); i >= 1900; i--) {
            years.push(i);
        }
        this.set("years", years);

        this.set("locations", []);
        this.set("locationLabels", []);
        this._wineCriteriasService.getLocations()
            .then(d => {
                this.set("locations", d);
                this.set("locationLabels", d.map(x => x.label));
            });
    }

    load(wineTasting: WineTasting) {
        //TODO : Get picture

        this.set("estate", wineTasting.estate);
        this.set("region", wineTasting.region);
        this.set("name", wineTasting.name);
        this.set("country", wineTasting.country);
        this.set("aoc", wineTasting.aoc);
        this.set("selectedYearIndex", this.get("years").indexOf(wineTasting.year));
        this.set("selectedWineType", this.get("wineTypes").indexOf(wineTasting.wineType));
        this.set("rawAlcoolValue", wineTasting.alcohol * 10);
        this.set("isBiodynamic", wineTasting.isBiodynamic);
        this.set("isBlindTasting", wineTasting.isBlindTasting);
        this.set("selectedGrapes", wineTasting.grapes);
        this.set("comments", wineTasting.comments);
        this.set("tastingDate", wineTasting.tastingDate);
        this.set("wineColor", wineTasting.color);
        this.set("finalRating", wineTasting.finalRating);
        this.set("selectedAromas", wineTasting.aromas);
        this.set("selectedAromaDefects", wineTasting.defects);
        this.set("selectedFlavorDefects", wineTasting.flavorDefects);
        this.set("selectedFlavors", wineTasting.flavors);
        this.set("selectedAttacks", wineTasting.attacks);
        this.set("selectedLimpidities", wineTasting.limpidities);
        this.set("selectedShines", wineTasting.shines);
        this.set("selectedTears", wineTasting.tears);
        this.set("hasBubbles", wineTasting.hasBubbles);
        this.set("hasDeposit", wineTasting.hasDeposit);
        this.set("selectedNoseIntensities", wineTasting.noseIntensities);
        this.set("selectedLength", wineTasting.length);
        this.set("containsPicture", wineTasting.containsPicture);
        this.set("winePairing", wineTasting.winePairing);
        this.set("selectedWinePotentials", wineTasting.winePotentials);
        this.set("selectedTasteIntensities", wineTasting.tasteIntensities);
        this.set("selectedTannins", wineTasting.tannins);
        this.set("selectedAcidities", wineTasting.acidities);
        this.set("selectedNoseDevelopments", wineTasting.noseDevelopments);
    }

    saveTasting() {
        return new Promise<boolean>((resolve, reject) => {
            //TODO : Récupérer le location label - S'il existe pas => le créer en mode custom

            var wineTasting = <WineTasting>{
                estate: this.get("estate"),
                region: this.get("region"),
                name: this.get("name"),
                country: this.get("country"),
                aoc: this.get("aoc"),
                year: this.get("selectedYear"),
                wineType: this.get("wineTypes")[this.get("selectedWineType")],
                alcohol: this.get("alcoolValue"),
                isBiodynamic: this.get("isBiodynamic"),
                isBlindTasting: this.get("isBlindTasting"),
                grapes: this.get("selectedGrapes"),
                comments: this.get("comments"),
                tastingDate: this.get("tastingDate"),
                color: this.get("wineColor"),
                finalRating: this.get("finalRating"),
                aromas: this.get("selectedAromas"),
                defects: this.get("selectedAromaDefects"),
                flavorDefects: this.get("selectedFlavorDefects"),
                flavors: this.get("selectedFlavors"),
                attacks: this.get("selectedAttacks"),
                limpidities: this.get("selectedLimpidities"),
                shines: this.get("selectedShines"),
                tears: this.get("selectedTears"),
                hasBubbles: this.get("hasBubbles"),
                hasDeposit: this.get("hasDeposit"),
                noseIntensities: this.get("selectedNoseIntensities"),
                length: this.get("selectedLength"),
                containsPicture: this.get("picture") ? true : false,
                winePairing: this.get("winePairing"),
                winePotentials: this.get("selectedWinePotentials"),
                tasteIntensities: this.get("selectedTasteIntensities"),
                tannins: this.get("selectedTannins"),
                acidities: this.get("selectedAcidities"),
                noseDevelopments: this.get("selectedNoseDevelopments")
            };

            let wineTastingPicturePath = null;
            if (this.get("picture")) {
                wineTastingPicturePath = fs.path.join(fs.knownFolders.temp().path, Date.now() + ".png");
                this.get("picture").saveToFile(wineTastingPicturePath, "png");
            }

            var service = new TastingsService();
            service.saveTasting(wineTasting, wineTastingPicturePath).then(() => {
                if (!_.isEmpty(wineTastingPicturePath) && fs.File.exists(wineTastingPicturePath)) {
                    fs.File.fromPath(wineTastingPicturePath).remove();
                }
                resolve(true);
            }).catch(error => {
                reject(error);
            });
        });
    }

    private loadCriteria(criteria, property?) {
        var propertyName = property || criteria;
        this.set(propertyName, []);
        this._wineCriteriasService.getCriterias(criteria)
            .then(d => this.set(propertyName, d));
    }
}