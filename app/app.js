import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoginPage} from './pages/login/login';
import {TastingsPage} from './pages/tastings/tastings';
import {UserData} from './providers/user-data';
import {TastingsData} from './providers/tastings-data';
import {WineData} from './providers/wine-data';

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [UserData, TastingsData, WineData]
})
export class WinenjoyApp {
  static get parameters() {
    return [[Platform], [UserData]];
  }

  constructor(platform, userData) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleLightContent();
    });

    userData.isLogged().then(isLogged => {
        if (isLogged) {
            this.rootPage = TastingsPage;
        } else {
            this.rootPage = LoginPage;
        }
    });
  }
}
