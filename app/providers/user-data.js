import {Injectable} from 'angular2/core';
import {Storage, SqlStorage, Events} from 'ionic-angular';

@Injectable()
export class UserData {
  static get parameters(){
    return [[Events]];
  }

  constructor(events) {
    this.storage = new Storage(SqlStorage, { name: "winenjoy" });
    this.USER_KEY = 'USER';
  }

  login(loginData) {
    return new Promise((resolve, reject) => {
        var myFirebaseRef = new Firebase("https://winenjoy.firebaseio.com/beta-testers");
        myFirebaseRef.orderByChild("email").equalTo(loginData.email.toLowerCase().trim()).limitToFirst(1).once("value", data => {
            if(!data) {
                reject("Connexion impossible.");
                return;
            }

            var result = data.val();

            if (!result || result.length === 0) {
                reject("Connexion impossible.");
                return;
            }

            this.storage.set(this.USER_KEY, JSON.stringify({ email: loginData.email.toLowerCase().trim()}));
            resolve(true);
        }, error => {
            reject("Connexion impossible.");
        }, this);
    });
  }

  // return a promise
  isLogged() {
    return this.storage.get(this.USER_KEY).then((value) => {
        return value;
    });
  }
}