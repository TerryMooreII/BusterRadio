import {Component, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";

@Component({
    selector: 'br-user-header',
    templateUrl: './user-header.component.html',
    styleUrls: ['./user-header.component.less']
})
export class UserHeaderComponent implements OnInit {

    user: any;

    constructor(private af: AngularFire) {
    }

    ngOnInit() {
        this.af.auth.asObservable().subscribe(user => {
            if (!user) {
                this.user = null;
                return;
            }

            if (user.google) {
                this.user = user.google;
            } else if (user.facebook) {
                this.user = user.facebook;
            }
        });
    }
}
