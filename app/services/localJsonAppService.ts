import fs = require("file-system");
import {IAppService} from "./iAppService";
import {WineTasting} from "../entities/wineTasting";
import {CriteriaItem} from "../entities/criteriaItem";

export class LocalJsonAppService implements IAppService {
    private _wineTastingsCollectionName = "wineTastings";

    public getWineTastings(): WineTasting[] {
        return [];
        // return this.deserialize<WineTasting>(this._wineTastingsCollectionName);
    }

    public getYears(): number[] {
        let result = [];
        let currentYear = new Date().getFullYear();
        for (let i = 1900; i <= currentYear; i++) {
            result.push(i);
        }
        return result;
    }

    public getWineTypes(): CriteriaItem[] {
        return [
          {
              id: 0,
              name: "Blanc",
              order: 0
          },
          {
              id: 1,
              name: "Rosé",
              order: 1
          },
          {
              id: 2,
              name: "Rouge",
              order: 2
          }
        ];
    }

    public getIntensityCriterias(): CriteriaItem[] {
        return [
            {
                id: 0,
                name: "Pâle",
                order: 0
            },
            {
                id: 1,
                name: "Moyenne",
                order: 1
            },
            {
                id: 2,
                name: "Intense",
                order: 2
            }
        ];
    }

    public getBubbleCriterias(): CriteriaItem[] {
        return [
            {
                id: 0,
                name: "Aucun",
                order: 0
            },
            {
                id: 1,
                name: "Peu",
                order: 1
            },
            {
                id: 2,
                name: "Abondantes",
                order: 2
            }
        ];
    }

    public getTearCriterias(): CriteriaItem[] {
        return [
            {
                id: 0,
                name: "Aucun",
                order: 0
            },
            {
                id: 1,
                name: "Courtes",
                order: 1
            },
            {
                id: 2,
                name: "Longues",
                order: 2
            },
            {
                id: 3,
                name: "Grasses",
                order: 3
            },
            {
                id: 4,
                name: "Fluides",
                order: 4
            },
            {
                id: 5,
                name: "Abondantes",
                order: 5
            }
        ];
    }

    public getLimpidityCriterias(): CriteriaItem[] {
        return [
            {
                id: 0,
                name: "Net",
                order: 0
            },
            {
                id: 1,
                name: "Trouble",
                order: 1
            },
            {
                id: 2,
                name: "Flou",
                order: 2
            },
            {
                id: 3,
                name: "Limpide",
                order: 3
            },
            {
                id: 4,
                name: "Cristallin",
                order: 4
            },
            {
                id: 5,
                name: "Voilé",
                order: 5
            }
        ];
    }

    /*
     * Utils
     * //TODO : Externalize in utils
     */

    // Use ApplicationSettings instead

//     private deserialize<T>(collectionName: string): T[] {
//         let filePath = fs.path.join(fs.knownFolders.documents().path, collectionName + ".json");
//
//         let file = fs.File.fromPath(filePath);
//         if (!file) {
//             return null;
//         }
//
//         let fileContent = file.readTextSync();
//         if (!fileContent) {
//             return null;
//         }
//
//         return <T[]>JSON.parse(fileContent);
//     }
//
//     private serialize(collectionName: string, collection: any[]) {
//         let filePath = fs.path.join(fs.knownFolders.documents().path, collectionName + ".json");
//         fs.File.fromPath(filePath).writeText(JSON.stringify(collection));
//     }
}
