import { Component, OnInit } from '@angular/core';
import {AngularFire} from "angularfire2";

@Component({
  selector: 'br-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  constructor(private af:AngularFire) { }

  ngOnInit() {}

    login() {
        this.af.auth.login();
    }

    logout() {
        this.af.auth.logout();
    }


}
