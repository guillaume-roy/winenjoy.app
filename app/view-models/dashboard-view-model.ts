import {Observable} from "data/observable";
import {UserService} from "../services/userService";
import {WineCriteriasService} from "../services/wineCriteriasService";
import _ = require("lodash");

export class DashboardViewModel extends Observable {
    private _wineCriteriasService;

    constructor() {
        super();
        this.set("isBusy", true);

        this._wineCriteriasService = new WineCriteriasService();
    }

    load() {
        this.set("isBusy", true);

        var service = new UserService();
        var userStats = service.getUserStats();

        this.set("userStats", userStats);
        this.set("averageRating", Math.round(userStats.averageRating));
        this.set("tastingsByWineType", this.toArrayWithLabel(userStats.tastingsByWineType, "code", "wineTypes"));
        this.set("tastingsByRegion", this.toArrayWithLabel(userStats.tastingsByRegion, "id", "regions"));
        this.set("tastingsByCountry", this.toArrayWithLabel(userStats.tastingsByCountry, "id", "countries"));
        this.set("tastingsByAoc", this.toArrayWithLabel(userStats.tastingsByAoc, "id", "aoc"));
        this.set("tastingsByWineYear", this.toArray(userStats.tastingsByWineYear));
        this.set("tastingsByGrape", this.toArrayWithLabel(userStats.tastingsByGrape, "id", "grapes"));
        this.set("tastingsByAroma", this.toArrayWithLabel(userStats.tastingsByAroma, "id", "aromas"));
        this.set("tastingsByFlavor", this.toArrayWithLabel(userStats.tastingsByFlavor, "id", "aromas"));
        this.set("tastingsByTastingYear", this.toArray(userStats.tastingsByTastingYear));
        
        this.set("isBusy", false);
    }

    private toArray(sourceObject: { [id: string]: string[] }) {
        var array = [];

        if (sourceObject) {
            for (var property in sourceObject) {
                var value = sourceObject[property];
                array.push({
                    label: property,
                    total: value.length
                });
            }
        }

        return array;
    }

    private toArrayWithLabel(sourceObject: { [id: string]: string[] }, propertyName: string, criteria: string) {
        var array = [];

        if (sourceObject) {
            for (var property in sourceObject) {
                var value = sourceObject[property];
                array.push({
                    label: this.getLabel(propertyName, property, criteria),
                    total: value.length
                });
            }
        }

        return array;
    }

    private getLabel(propertyName: string, propertyValue: any, criteriaName: string) {
        console.log("----------");
        console.log(criteriaName);
        console.log(propertyName);
        console.log(propertyValue);

        var criterias = this._wineCriteriasService.wineCriterias[criteriaName];
        var criteria = <any>_.find(criterias, [propertyName, propertyValue]);
        return criteria.label;
    }
}