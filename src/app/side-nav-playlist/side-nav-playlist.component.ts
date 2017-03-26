import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFire, FirebaseAuthState} from 'angularfire2';

@Component({
    selector: 'br-side-nav-playlist',
    templateUrl: './side-nav-playlist.component.html',
    styleUrls: ['./side-nav-playlist.component.less']
})
export class SideNavPlaylistComponent implements OnInit {

    playlists: Observable<any>;
    artists: Observable<any>;
    user: FirebaseAuthState;

    constructor(private af: AngularFire) {

    }

    ngOnInit() {
        this.af.auth.asObservable().subscribe(user => {
            if (!user) {
                this.user = null;
                this.playlists = null;
                this.artists = null;
                return;
            }
            this.user = user;
            this.playlists = this.af.database.list('/favorite-show/' + this.user.uid);
            this.artists = this.af.database.list('/favorite-artist/' + this.user.uid);
        });
    }
}
