import fs = require("file-system");
import {IAppService} from "./iAppService";
import {WineTasting} from "../entities/wineTasting";

export class LocalJsonAppService implements IAppService {
    private _wineTastingsCollectionName = "wineTastings";

    /*
     * Wine tasting
     */

    public getWineTastings(): WineTasting[] {
        return this.deserialize<WineTasting>(this._wineTastingsCollectionName);
    }

    /*
     * Utils
     * //TODO : Externalize in utils
     */

    private deserialize<T>(collectionName: string): T[] {
        let filePath = fs.path.join(fs.knownFolders.documents().path, collectionName + ".json");

        let file = fs.File.fromPath(filePath);
        if (!file) {
            return null;
        }

        let fileContent = file.readTextSync();
        if (!fileContent) {
            return null;
        }

        return <T[]>JSON.parse(fileContent);
    }

    private serialize(collectionName: string, collection: any[]) {
        let filePath = fs.path.join(fs.knownFolders.documents().path, collectionName + ".json");
        fs.File.fromPath(filePath).writeText(JSON.stringify(collection));
    }
}
