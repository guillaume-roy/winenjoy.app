import {IonicApp, Page, NavController} from 'ionic-angular';
import {UserData} from '../../providers/user-data';
import {TastingsPage} from '../tastings/tastings';

@Page({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
    static get parameters() {
        return [[NavController], [UserData]];
    }

    constructor(nav, userData)  {
        this.nav = nav;
        this.userData = userData;

        this.login = {};
        this.submitted = false;
    }

    onLogin(form) {
        this.submitted = true;

        if (form.valid) {
            this.userData.login(form.value);
            this.nav.setRoot(TastingsPage);
        }
    }
}
