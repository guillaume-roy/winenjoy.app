import {User} from "../entities/user";
import appSettings = require("application-settings");
import _ = require("lodash");

export class UserService {
    private static USER_KEY = "USER";

    public getUser(): Promise<User> {
        return new Promise<User>((resolve, reject) => {
           resolve(<User>JSON.parse(appSettings.getString(UserService.USER_KEY)));
        });
    }

    public setUser(value: User) {
        appSettings.setString(UserService.USER_KEY, JSON.stringify(value));
    }

    public isLogged() {
        return !_.isEmpty(appSettings.getString(UserService.USER_KEY));
    }
}
