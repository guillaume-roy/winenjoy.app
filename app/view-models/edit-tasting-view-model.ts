import {Observable} from "data/observable";
import {WineCriteriasService} from "../services/wineCriteriasService";

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
        this.loadCriteria("limpidities");
        this.loadCriteria("shines");
        this.loadCriteria("tears");
        this.loadCriteria("intensities");
        this.loadCriteria("developments", "noseDevelopments");
        this.loadCriteria("attacks");
        this.loadCriteria("acidities");
        this.loadCriteria("tannins");
        this.loadCriteria("intensities", "tasteIntensities");
        this.loadCriteria("length");
        this.loadCriteria("developments", "potentials");

        this.set("selectedWineType", 0);
        this.set("selectedAromas", []);
        this.set("selectedAromaDefects", []);
        this.set("selectedFlavors", []);
        this.set("selectedFlavorDefects", []);
        this.set("picture", null);
        this.set("selectedLimpidities", []);
        this.set("selectedPotentials", []);
        this.set("selectedLength", []);
        this.set("selectedTasteIntensities", []);
        this.set("selectedTannins", []);
        this.set("selectedAcidities", []);
        this.set("selectedAttacks", []);
        this.set("selectedNoseDevelopments", []);
        this.set("selectedIntensities", []);
        this.set("selectedTears", []);
        this.set("selectedShines", []);
        this.set("selectedGrapes", []);
        this.set("tastingDate", new Date());

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

    saveTasting() {
        //Récupérer le location label
        //  S'il existe pas => le créer en mode custom
        console.log("saveTasting");
    }
    
    private loadCriteria(criteria, property?) {
        var propertyName = property || criteria;
        this.set(propertyName, []);
        this._wineCriteriasService.getCriterias(criteria)
            .then(d => this.set(propertyName, d));
    }
}