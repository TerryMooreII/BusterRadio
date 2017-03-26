import {Injectable} from "@angular/core";
import {AngularFire, FirebaseAuthState} from "angularfire2";
import {NullifyService} from "../nullify/nullify.service";

@Injectable()
export class FavoriteService {

    private user: FirebaseAuthState;

    constructor(private af: AngularFire, private nullify: NullifyService) {
        this.af.auth.asObservable().subscribe(user => this.user = user);
    }


    addFavoriteShow(show) {
        show.uid = this.user.uid;
        show.route = window.location.hash.substr(1);

        this.af.database.list('/favorite-show').push(this.nullify.nullify(show));
    }

}
