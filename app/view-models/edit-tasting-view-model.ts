import {Observable} from "data/observable";
import {WineCriteriasService} from "../services/wineCriteriasService";
import {WineTasting} from "../entities/wineTasting";
import {TastingsService} from "../services/tastingsService";
import fs = require("file-system");
import _ = require("lodash");
import {CriteriaItem} from "../entities/criteriaItem";

export enum EditTastingMode {
    Normal,
    Full
}

export class EditTastingViewModel extends Observable {
    private _wineCriteriasService: WineCriteriasService;
    private _rawAlcoolValue: number;
    private _selectedYearIndex: number;
    private _editTastingMode: EditTastingMode;

    get selectedYearIndex() {
        return this._selectedYearIndex;
    }
    set selectedYearIndex(value) {
        this._selectedYearIndex = value;
        this.notifyPropertyChange("selectedYearIndex", value);

        this.set("selectedYear", this.get("years")[value]);
    }

    set rawAlcoolValue(value) {
        this._rawAlcoolValue = parseFloat(value.toFixed(1));
        this.notifyPropertyChange("rawAlcoolValue", value);

        this.set("alcoolValue", (value / 10).toFixed(1));
    }
    get rawAlcoolValue() {
        return this._rawAlcoolValue;
    }

    constructor(editTastingMode: EditTastingMode) {
        super();
        this._editTastingMode = editTastingMode;
        this._wineCriteriasService = new WineCriteriasService();
    }

    init() {
        return new Promise<boolean>((resolve, reject) => {
            try {
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
                this.set("tastingDate", Date.now());
                this.set("finalRating", 2);
                this.set("containsPicture", false);
                this.set("locations", []);
                this.set("locationLabels", []);
                this.set("isBiodynamic", false);
                this.set("isBlindTasting", false);
                this.set("hasBubbles", false);
                this.set("hasDeposit", false);

                this.loadCriterias()
                    .then(() => resolve(true))
                    .catch(e => reject(e));
            } catch (error) {
                reject(error);
            }
        });
    }

    load(wineTasting: WineTasting) {
        switch (wineTasting.wineType.code) {
            case "WHITE":
                this.set("selectedWineType", 0);
                break;
            case "ROSE":
                this.set("selectedWineType", 1);
                break;
            case "RED":
                this.set("selectedWineType", 2);
                break;
        }

        if (wineTasting.year && wineTasting.year > 0) {
            this.set("selectedYearIndex", this.get("years").indexOf(wineTasting.year));
        }

        this.set("estate", wineTasting.estate);
        this.set("region", wineTasting.region);
        this.set("name", wineTasting.name);
        this.set("country", wineTasting.country);
        this.set("aoc", wineTasting.aoc);
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

        this.set("editWineTasting", wineTasting);
        this.set("isEdit", true);
        this.set("pictureEditMode", "");
    }

    saveTasting(locationLabel: string) {
        return new Promise<boolean>((resolve, reject) => {
            var wineTasting = this.getModel(locationLabel);

            let wineTastingPicturePath = null;
            if (this.get("picture")) {
                wineTastingPicturePath = fs.path.join(fs.knownFolders.temp().path, Date.now() + ".png");
                this.get("picture").saveToFile(wineTastingPicturePath, "png");
            }

            var service = new TastingsService();
            if (this.get("isEdit")) {
                var updatedWineTasting = _.assignIn({}, this.get("editWineTasting"), wineTasting);
                service.updateTasting(updatedWineTasting, wineTastingPicturePath, this.get("pictureEditMode")).then(() => {
                    if (!_.isEmpty(wineTastingPicturePath) && fs.File.exists(wineTastingPicturePath)) {
                        fs.File.fromPath(wineTastingPicturePath).remove();
                    }
                    resolve(true);
                }).catch(error => {
                    reject(error);
                });
            } else {
                service.saveTasting(wineTasting, wineTastingPicturePath).then(() => {
                    if (!_.isEmpty(wineTastingPicturePath) && fs.File.exists(wineTastingPicturePath)) {
                        fs.File.fromPath(wineTastingPicturePath).remove();
                    }
                    resolve(true);
                }).catch(error => {
                    reject(error);
                });
            }
        });
    }

    deleteTasting() {
        var service = new TastingsService();
        return service.deleteTasting(this.get("editWineTasting"));
    }

    loadCriterias() {
        var promises = [
            this._wineCriteriasService.getLocations()
                .then(d => {
                    this.set("locations", d);
                    this.set("locationLabels", d.map(x => x.label));
                }),
            this.loadCriteria("years"),
            this.loadCriteria("intensities", "noseIntensities"),
            this.loadCriteria("intensities", "tasteIntensities"),
            this.loadCriteria("developments", "winePotentials"),
            this.loadCriteria("wineTypes")
        ];

        if (this._editTastingMode === EditTastingMode.Full) {
            promises.push(this.loadCriteria("limpidities"));
            promises.push(this.loadCriteria("shines"));
            promises.push(this.loadCriteria("tears"));
            promises.push(this.loadCriteria("developments", "noseDevelopments"));
            promises.push(this.loadCriteria("attacks"));
            promises.push(this.loadCriteria("acidities"));
            promises.push(this.loadCriteria("tannins"));
            promises.push(this.loadCriteria("length"));
        }

        return Promise.all(promises);
    }

    getModelHashCode(locationLabel: string) {
        return this.hashCode(JSON.stringify(this.getModel(locationLabel)));
    }

    private loadCriteria(criteria, property?) {
        var propertyName = property || criteria;
        this.set(propertyName, []);
        return this._wineCriteriasService.getCriteriasFromFirebase(criteria)
            .then(d => this.set(propertyName, d))
            .catch(e => console.dump(e));
    }

    private getModel(locationLabel: string) {
        if (!_.isEmpty(locationLabel)) {
            var locations = <CriteriaItem[]>this.get("locations");
            var location = _.find(locations, { label: locationLabel });

            if (!_.isEmpty(location)) {
                switch (location.type) {
                    case "aoc":
                        var aoc = this._wineCriteriasService.getAoc(location.id);
                        this.set("aoc", aoc);
                        var region = this._wineCriteriasService.getRegion(aoc.parentId);
                        this.set("region", region);
                        var country = this._wineCriteriasService.getCountry(region.parentId);
                        this.set("country", country);
                        break;
                    case "region":
                        var region1 = this._wineCriteriasService.getRegion(location.id);
                        this.set("region", region1);
                        var country1 = this._wineCriteriasService.getCountry(region1.parentId);
                        this.set("country", country1);
                        break;
                    case "country":
                        var country2 = this._wineCriteriasService.getCountry(location.id);
                        this.set("country", country2);
                        break;
                }
            }
        }

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

        if (this.get("isEdit")) {
            return _.assignIn({}, this.get("editWineTasting"), wineTasting);
        } else {
            return wineTasting;
        }
    }

    private hashCode(str) {
        var hash = 0, i, chr, len;
        if (str.length === 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
}