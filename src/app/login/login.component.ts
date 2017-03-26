import {Component, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";

@Component({
    selector: 'br-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

    isLoggedIn: any;

    constructor(private af: AngularFire) {
    }

    ngOnInit() {
        this.af.auth.asObservable().subscribe(user => {
            if (!user){
                this.isLoggedIn = false
                return;
            }
            this.isLoggedIn = true;
        });
    }

    logout() {
        this.isLoggedIn = false;
        this.af.auth.logout();
    }


}
