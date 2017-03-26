import {Component, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";

@Component({
    selector: 'br-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

    constructor(private af:AngularFire, private router:Router) {
    }

    ngOnInit() {
        this.af.auth.subscribe(user => {
            if (user && user.uid) {
                this.router.navigate(['/']);
            }
        });
    }

    login() {
        this.af.auth.login();
    }

}

