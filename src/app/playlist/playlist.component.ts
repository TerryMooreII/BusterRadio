import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {PlaylistService} from "../services/playlist/playlist.service";
import {PlaylistItem} from "../models/playlistItem";
import {CacheService} from "../services/cache/cache.service";
import {Observable} from "rxjs";

@Component({
    selector: 'br-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistComponent implements OnInit {

    playlist:Observable<Array<PlaylistItem>>;

    constructor(private playlistService: PlaylistService, private cache:CacheService) {
    }

    ngOnInit() {
        this.playlist = this.playlistService.getPlaylist();
    }

    play(index) {
        this.playlistService.playPlayListItem(index);
    }

    clear(){
        this.playlistService.clear();
    }

    getArtistIdentifier(artist){
        return this.cache.getIdentifierByArtist(artist);
    }

    goToAlbum(track){
        if (!track){
            return;
        }

        var year = this.getYear(track.album);

        if (!year){
            return ['/artists', this.getArtistIdentifier(track.creator), 'years'];
        }

        return ['/artists', this.getArtistIdentifier(track.creator), 'years', year, 'shows', track.identifier];
    }

    private getYear(album){
        if (!album){
            return null;
        }
        return album.substr(0, 4);
    }

    parseTitle(show) {
        console.log('parsetitie');
        if (!show || !show.title) {
            return null;
        }

        let rep = new RegExp("(.*?) Live at (.*?) on (.*)").exec(show.title);
        if (rep && rep.length && rep.length >= 1) {
            return {
                artist: rep[1],
                venue: rep[2],
                date: rep[3]
            }

        }
        return null
    }
}
