import {Observable} from "data/observable";
import {WineCriteriasService} from "../services/wineCriteriasService";

export class EditTastingViewModel extends Observable {
    private _wineCriteriasService: WineCriteriasService;
    private _rawAlcoolValue: number;

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
        this.set("tastingDate", new Date());
    }

    saveTasting() {
        console.log("saveTasting");
    }

    private loadCriteria(criteriaName, criteriaProperty?) {
        this._wineCriteriasService.getCriterias(criteriaName)
            .then(d => this.set(criteriaProperty || criteriaName, d));
    }
}