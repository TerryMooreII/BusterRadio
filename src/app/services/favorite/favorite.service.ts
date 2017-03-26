import {Injectable} from '@angular/core';
import {AngularFire, FirebaseAuthState} from 'angularfire2';
import {NullifyService} from '../nullify/nullify.service';
import {Router} from '@angular/router';

@Injectable()
export class FavoriteService {

    private user: FirebaseAuthState;

    constructor(private af: AngularFire, private nullify: NullifyService, private router: Router) {
        this.af.auth.asObservable().subscribe(user => this.user = user);
    }


    addFavoriteShow(show) {
        if (!this.user) {
            this.router.navigate(['/register']);
            return false;
        }

        show.route = window.location.hash.substr(1);
        this.af.database.list('/favorite-show/' + this.user.uid).push(this.nullify.nullify(show));
        return true;
    }

    isFavoriteShow(show) {
        if (!this.user) {
            return;
        }

        return this.af.database.list('/favorite-show/' + this.user.uid, {
            query: {
                equalTo: show.identifier,
                orderByChild: 'identifier'
            }
        });

    }

    removeFavoriteShow(show) {
        const obs$ = this.af.database.list('/favorite-show/' + this.user.uid, {
            preserveSnapshot: true,
            query: {
                equalTo: show.identifier,
                orderByChild: 'identifier'
            }
        });
        const me = obs$.subscribe(data => {
            data.forEach(fav => {
                fav.ref.remove();
                me.unsubscribe(); // somethings smells here, may need to rethink abstracting af to services
            });
        });
    }

    addFavoriteArtist(artist) {
        if (!this.user) {
            this.router.navigate(['/register']);
            return false;
        }
        console.log(artist);
        this.af.database.list('/favorite-artist/' + this.user.uid).push(this.nullify.nullify(artist));
        return true;
    }

    isFavoriteArtist(artist) {
        if (!this.user) {
            return;
        }

        return this.af.database.list('/favorite-artist/' + this.user.uid, {
            query: {
                equalTo: artist.identifier,
                orderByChild: 'identifier'
            }
        });

    }

    removeFavoriteArtist(artist) {
        const obs$ = this.af.database.list('/favorite-artist/' + this.user.uid, {
            preserveSnapshot: true,
            query: {
                equalTo: artist.identifier,
                orderByChild: 'identifier'
            }
        });
        const me = obs$.subscribe(data => {
            data.forEach(fav => {
                fav.ref.remove();
                me.unsubscribe(); // somethings smells here, may need to rethink abstracting af to services
            });
        });
    }
}
