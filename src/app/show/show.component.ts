import {Component, OnInit} from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import {ArchiveService} from '../services/archive/archive.service';
import {Show} from '../models/show';
import {PlaylistService} from '../services/playlist/playlist.service';
import {CacheService} from '../services/cache/cache.service';
import {FavoriteService} from '../services/favorite/favorite.service';
import {MaterializeAction} from 'angular2-materialize';
import {ToasterService} from '../services/toster/toaster.service';

@Component({
    selector: 'br-show',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.less']
})

export class ShowComponent implements OnInit {

    show: Show;
    isLoading: boolean = false;
    isFavoriteShow = false;

    constructor(private route: ActivatedRoute,
                private archiveService: ArchiveService,
                private playlist: PlaylistService,
                private cache: CacheService,
                private favorite: FavoriteService,
                private toaster: ToasterService) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let identifier = params['show'];
            this.getShow(identifier);
        });
    }

    getShow(identifier) {
        this.isLoading = true;
        this.archiveService.getShow(identifier).subscribe(response => {
            this.show = new Show(response._body);
            this.bandImage();
            this.isLoading = false;
            const obs$ = this.favorite.isFavoriteShow(this.show);
            if (obs$) {
                obs$.subscribe(data => this.isFavoriteShow = data.length > 0);
            }

        });
    }

    play(tracks, playIndex) {
        this.playlist.add(tracks, playIndex);
    }

    addToPlaylist(track) {
        let message;
        this.playlist.add(track);
        if (Array.isArray(track)) {
            message = 'Show added to queue';
        } else {
            message = 'Track added to queue';
        }
        this.toaster.toast(message);
    }

    addFavoriteShow(show) {
        if (this.favorite.addFavoriteShow(show)) {
            this.toaster.toast('Show added to favorites');
        }
    }

    removeFavoriteShow(show) {
        this.favorite.removeFavoriteShow(show);
        this.toaster.toast('Remove show from favorites');
    }

    getIdentifierByArtist(artist) {
        return this.cache.getIdentifierByArtist(artist);
    }

    bandImage() {
        if (!this.show) {
            return '';
        }
        return '//archive.org/services/img/' + this.cache.getIdentifierByArtist(this.show.artist);
    }
}
