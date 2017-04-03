import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {PlaylistService} from "../services/playlist/playlist.service";
import {PlaylistItem} from "../models/playlistItem";
import {CacheService} from "../services/cache/cache.service";
import {Observable} from "rxjs";
import {QueueManagerService} from '../services/queue-manager/queue-manager.service';

@Component({
    selector: 'br-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistComponent implements OnInit {

    playlist: Observable<Array<PlaylistItem>>;
    currentTrack: any;

    constructor(private playlistService: PlaylistService, private cache: CacheService, private queueManager:QueueManagerService) {
    }

    ngOnInit() {
        this.playlist = this.playlistService.getPlaylist();
        this.currentTrack = this.queueManager.getCurrentTrack();
    }

    play(index) {
        this.playlistService.playPlayListItem(index);
    }

    pause() {
       this.queueManager.isPlaying(false);
    }

    resume() {
        this.queueManager.isPlaying(true);
    }

    clear() {
        this.playlistService.clear();
    }

    getArtistIdentifier(artist) {
        return this.cache.getIdentifierByArtist(artist);
    }

    goToAlbum(track) {
        if (!track) {
            return;
        }

        const year = this.getYear(track.album);

        if (!year) {
            return ['/artists', this.getArtistIdentifier(track.creator), 'years'];
        }

        return ['/artists', this.getArtistIdentifier(track.creator), 'years', year, 'shows', track.identifier];
    }

    bandImage(artist){
        if (!artist){
            return '';
        }
        let url = 'http://archive.org/services/img/' + this.cache.getIdentifierByArtist(artist);
        return url;

    }

    private getYear(album) {
        if (!album) {
            return null;
        }
        return album.substr(0, 4);
    }
}
