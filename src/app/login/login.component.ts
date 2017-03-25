import {Component, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";

@Component({
    selector: 'br-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

    user: any;

    constructor(private af: AngularFire) {
    }

    ngOnInit() {
        this.af.auth.asObservable().subscribe(user => {
            if (!user){
                this.user = null;
                return;
            }

            if (user.google){
                this.user = user.google;
            }else if(user.facebook){
                this.user = user.facebook;
            }
        });
    }

    login() {
        this.af.auth.login();

    }

    logout() {
        this.user = null;
        this.af.auth.logout();
    }


}
