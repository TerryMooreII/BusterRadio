import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";

@Injectable()
export class LiveService {

    private live: FirebaseListObservable<object>;

    constructor(private af: AngularFire) {
        this.live = this.af.database.list('live', {
            query: {
                limitToLast: 50

            }
        });
    }


    list() {
        return this.live;
    }

    add(data) {
        if (!data) {
            return;
        }

        data.createdAt = Date.now();

        this.live.push(data);
    }

}
