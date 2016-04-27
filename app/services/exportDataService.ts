import {TastingsService} from "./tastingsService";

export class ExportDataService {
    public exportTastingsToJson() {
        return new Promise<boolean>((resolve, reject) => {
            let externalStorageState = android.os.Environment.getExternalStorageState();
            let externalStorageDirectory = android.os.Environment.getExternalStoragePublicDirectory(
                android.os.Environment.DIRECTORY_DOWNLOADS);

            if (android.os.Environment.MEDIA_MOUNTED === externalStorageState && externalStorageDirectory.canWrite()) {
                externalStorageDirectory.mkdirs();

                let tastingsService = new TastingsService();
                tastingsService.getTastings().then(data => {
                    let exportFile = new java.io.File(externalStorageDirectory, "winenjoy_tastings.json");
                    let exportFileStream = new java.io.FileOutputStream(exportFile);
                    let printer = new java.io.PrintWriter(exportFileStream);

                    printer.print(JSON.stringify(data));
                    printer.flush();
                    printer.close();
                    exportFileStream.close();

                    resolve(true);
                });
            }
        });
    }

    public importTastingsFromJson() {
        return new Promise<boolean>((resolve, reject) => {
            let externalStorageState = android.os.Environment.getExternalStorageState();
            let externalStorageDirectory = android.os.Environment.getExternalStoragePublicDirectory(
                android.os.Environment.DIRECTORY_DOWNLOADS);

            if (android.os.Environment.MEDIA_MOUNTED === externalStorageState && externalStorageDirectory.canRead()) {
                let importFile = new java.io.File(externalStorageDirectory, "winenjoy_tastings.json");

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
