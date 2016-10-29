import {Component, OnInit} from '@angular/core';
import {PlaylistService} from "../services/playlist/playlist.service";
import {PlaylistItem} from "../models/playlistItem";
import {CacheService} from "../services/cache/cache.service";

@Component({
    selector: 'br-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.less']
})
export class PlaylistComponent implements OnInit {

    playlist:Array<PlaylistItem>;

    constructor(private playlistService: PlaylistService, private cache:CacheService) {
        this.playlist = [];
    }

    ngOnInit() {
        this.playlistService.getPlaylist().subscribe(data => {
            this.playlist = data;
        })
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
        if (!show || !show.title) {
            return 'Unknown';
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
