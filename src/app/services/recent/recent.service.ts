import {Injectable} from '@angular/core';
import {NullifyService} from '../nullify/nullify.service';
import {AngularFire} from 'angularfire2';

@Injectable()
export class RecentService {


    constructor(private af: AngularFire, private nullify: NullifyService) {
    }

    addRecentTrack(track) {
        this.af.auth.asObservable().subscribe(user => {
            if (!user) {
                return;
            }

            this.af.database.list('/recent-tracks/' + user.uid).push(this.nullify.nullify(track.track));
        });
    }
}
