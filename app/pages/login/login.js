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
        this.errorMessage = "";
    }

    onLogin(form) {
        this.submitted = true;
        this.errorMessage = "";

        if (form.valid) {
            this.userData.login(form.value).then(result => {
                this.nav.setRoot(TastingsPage);
            }, error => {
                this.errorMessage = error;
                this.submitted = false;
            });
        }
    }
}
