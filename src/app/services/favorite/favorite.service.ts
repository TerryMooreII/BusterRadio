import {Injectable} from "@angular/core";
import {AngularFire, FirebaseAuthState} from "angularfire2";
import {NullifyService} from "../nullify/nullify.service";
import {Router} from '@angular/router';

@Injectable()
export class FavoriteService {

    private user: FirebaseAuthState;

    constructor(private af: AngularFire, private nullify: NullifyService, private router:Router) {
        this.af.auth.asObservable().subscribe(user => this.user = user);
    }


    addFavoriteShow(show) {
        if (!this.user){
            this.router.navigate(['/register']);
            return;
        }
        
        show.route = window.location.hash.substr(1);

        this.af.database.list('/favorite-show/'+this.user.uid).push(this.nullify.nullify(show));
    }
}
