import {Observable} from "data/observable";
import {ExportDataService} from "../services/exportDataService";

export class ImportExportDataViewModel extends Observable {
    private _service: ExportDataService;
    private _storageDirectory: string;
    private _canRead: boolean;
    private _canWrite: boolean;
    private _resultMessage: string;

    public get storageDirectory() {
        return this._storageDirectory;
    }
    public set storageDirectory(value) {
        this._storageDirectory = value;
        this.notifyPropertyChange("storageDirectory", value);
    }

    public get resultMessage() {
        return this._resultMessage;
    }
    public set resultMessage(value) {
        this._resultMessage = value;
        this.notifyPropertyChange("resultMessage", value);
    }

    public get canRead() {
        return this._canRead;
    }
    public set canRead(value) {
        this._canRead = value;
        this.notifyPropertyChange("canRead", value);
    }

    public get canWrite() {
        return this._canWrite;
    }
    public set canWrite(value) {
        this._canWrite = value;
        this.notifyPropertyChange("canWrite", value);
    }

    constructor() {
        super();

        this._service = new ExportDataService();
        this._storageDirectory = this._service.storageDirectory;
        this._canRead = this._service.canRead;
        this._canWrite = this._service.canWrite;
    }

    public export() {
        return new Promise<boolean>((resolve, reject) => {
            this._service.exportTastingsToJson().then(res => {
               this.resultMessage = "Le fichier a été exporté vers " + res;
               resolve(true);
            });
        });
    }

    public import() {
        return new Promise<boolean>((resolve, reject) => {
            this._service.importTastingsFromJson().then(res => {
                this.resultMessage = "Le fichier a été importé.";
                resolve(true);
            });
        });
    }
}
