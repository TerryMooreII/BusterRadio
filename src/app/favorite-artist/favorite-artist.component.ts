import {Component, Input, OnInit} from '@angular/core';
import {FavoriteService} from '../services/favorite/favorite.service';
import {ToasterService} from '../services/toster/toaster.service';

@Component({
    selector: 'br-favorite-artist',
    templateUrl: './favorite-artist.component.html',
    styleUrls: ['./favorite-artist.component.less']
})
export class FavoriteArtistComponent implements OnInit {

    @Input() artist;
    isFavoriteArtist = false;

    constructor(private favorite: FavoriteService,
                private toaster: ToasterService) {
    }

    ngOnInit() {
        //stupid af auth being null on load
        setTimeout(() => {
            const obs$ = this.favorite.isFavoriteArtist(this.artist);
            if (obs$) {
                obs$.subscribe(data => this.isFavoriteArtist = data.length > 0);
            }
        }, 600);

    }


    addFavoriteArtist() {
        if (this.favorite.addFavoriteArtist(this.artist)){
            this.toaster.toast('Artist added to favorites');
        };

    }

    removeFavoriteArtist() {
        this.favorite.removeFavoriteArtist(this.artist);
        this.toaster.toast('Artist removed from favorites');
    }


}
