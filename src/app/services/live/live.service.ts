import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {NullifyService} from "../nullify/nullify.service";

@Injectable()
export class LiveService {

    private live: FirebaseListObservable<object>;

    constructor(private af: AngularFire, private nullify:NullifyService) {
        this.live = this.af.database.list('live', {
            query: {
                limitToLast: 50,
                orderBy: '-createdAt'
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

        this.live.push(this.nullify.nullify(data));
    }

}
