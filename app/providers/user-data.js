import {Injectable} from 'angular2/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';

@Injectable()
export class UserData {
  static get parameters(){
    return [[Events]];
  }

  constructor(events) {
    this.storage = new Storage(LocalStorage);
    this.events = events;
    this.USER_INFORMATIONS = 'USER_INFORMATIONS';
  }


  login(loginData) {
    this.storage.set(this.USER_INFORMATIONS, loginData);
    this.events.publish('user:login');
  }

  // return a promise
  isLogged() {
    return this.storage.get(this.USER_INFORMATIONS).then((value) => {
      return value;
    });
  }
}