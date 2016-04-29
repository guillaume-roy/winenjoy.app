import {TastingsService} from "./tastingsService";

export class ExportDataService {
    private _exportFilename = "winenjoy_tastings.db";
    private _storageDirectory: string;
    private _canRead: boolean;
    private _canWrite: boolean;

    public get storageDirectory() {
        return this._storageDirectory;
    }
    public set storageDirectory(value) {
        this._storageDirectory = value;
    }

    public get canRead() {
        return this._canRead;
    }
    public set canRead(value) {
        this._canRead = value;
    }

    public get canWrite() {
        return this._canWrite;
    }
    public set canWrite(value) {
        this._canWrite = value;
    }

    constructor() {
        let externalStorageState = android.os.Environment.getExternalStorageState();

        if (android.os.Environment.MEDIA_MOUNTED !== externalStorageState) {
            this._canRead = false;
            this._canWrite = false;
        } else {
            let externalStorageDirectory = android.os.Environment.getExternalStoragePublicDirectory(
                android.os.Environment.DIRECTORY_DOWNLOADS);

            this._canRead = externalStorageDirectory.canRead();
            this._canWrite = externalStorageDirectory.canWrite();
            this._storageDirectory = externalStorageDirectory.getAbsolutePath() + "/" + this._exportFilename;
        }
    }

    public exportTastingsToJson() {
        return new Promise<string>((resolve, reject) => {
            if (this._canWrite) {
                let externalStorageDirectory = android.os.Environment.getExternalStoragePublicDirectory(
                    android.os.Environment.DIRECTORY_DOWNLOADS);
                externalStorageDirectory.mkdirs();

                let tastingsService = new TastingsService();
                tastingsService.getTastings().then(data => {
                    let exportFile = new java.io.File(externalStorageDirectory, this._exportFilename);
                    let exportFileStream = new java.io.FileOutputStream(exportFile);
                    let printer = new java.io.PrintWriter(exportFileStream);

                    printer.print(JSON.stringify(data));
                    printer.flush();
                    printer.close();
                    exportFileStream.close();

                    resolve(exportFile.getAbsolutePath());
                });
            }
        });
    }

    public importTastingsFromJson() {
        return new Promise<boolean>((resolve, reject) => {
            if (this._canRead) {
                let externalStorageDirectory = android.os.Environment.getExternalStoragePublicDirectory(
                    android.os.Environment.DIRECTORY_DOWNLOADS);
                let importFile = new java.io.File(externalStorageDirectory, this._exportFilename);

                if (importFile.exists()) {
                    let sb = new java.lang.StringBuilder();
                    let br = new java.io.BufferedReader(new java.io.FileReader(importFile));
                    let line = "";

                    while ((line = br.readLine()) != null) {
                        sb.append(line);
                    }
                    br.close();

                    let result = JSON.parse(sb.toString());
                    let tastingsService = new TastingsService();
                    tastingsService.saveTastings(result);
                    resolve(true);
                }
            }
        });
    }
}
