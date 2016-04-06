import application = require("application");
import {Views} from "./utils/views";
import {UserService} from "./services/userService";
import {ColorUtils} from "./utils/color";

// TODO : Use moment.js
application.resources.dateConverter = function(value) {
    let date = new Date(value);
    let day = date.getDate();
    let month = date.getMonth();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return (day < 10 ? "0" + day : day) + "/" + (month < 10 ? "0" + month : month) + "/" + date.getFullYear() +
        " " + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
};

application.resources.labelConverter = function(value) {
    if (value && value.length > 0) {
        return value.map(v => {
            return v.label;
        });
    } else {
        return [];
    }
};

application.resources.finalRatingToImageConverter = function(value: string) {
    if (!value) {
        return null;
    }

    return "res://ic_" + value.toLowerCase();
};

application.resources.wineLocationConverter = function(value: any) {
    if (!value) {
        return null;
    }

    let result = "";

    if (value.region || value.country) {
        if (value.region) {
            result = value.region;
        }

        if (value.country) {
            if (result.length > 0) {
              result = result + " - " + value.country.label;
            } else {
                result = value.country.label;
            }
        }
    }

    return result;
};

application.resources.foregroundColorConverter = function(backgroundColor: string) {
    return ColorUtils.getForegroundColor(backgroundColor);
};

new UserService().isLogged().then(isLogged => {
   application.start({
        moduleName: isLogged ? Views.main : Views.login
    });
});
