import {Injectable} from '@angular/core';
import {PlaylistItem} from "../../models/playlistItem";
import {Subject, BehaviorSubject} from "rxjs";

@Injectable()
export class PlaylistService {

    private playList$: BehaviorSubject<PlaylistItem[]>;
    private dataStore: {
        playlist: PlaylistItem[]
    };
    private player$: BehaviorSubject<PlaylistItem>;
    private currentPlayingIndex: number;

    constructor() {
        this.dataStore = {playlist: []};
        this.playList$ = <BehaviorSubject<PlaylistItem[]>>new BehaviorSubject();
        this.player$ = new Subject();
    }


    getPlaylist() {
        return this.playList$.asObservable();
    }

    getPlayer() {
        return this.player$.asObservable();
    }

    add(tracks, playIndex) {
        this.currentPlayingIndex = playIndex;
        if (Array.isArray(tracks)) {

            this.dataStore.playlist = tracks.map((track, index) => {
                let play = index === this.currentPlayingIndex ? true : false;
                var playlistItem = new PlaylistItem(track, play);
                if (play) {
                    this.play(playlistItem);
                }

                return playlistItem;

            });

        } else {
            this.dataStore.playlist.push(new PlaylistItem(tracks));
        }
        this.updatePlaylistSubscribers();
    }

    next() {
        var total = this.dataStore.playlist.length;
        if (total === 0) {
            return;
        }
        this.dataStore.playlist[this.currentPlayingIndex].hasBeenPlayed = true;
        this.dataStore.playlist[this.currentPlayingIndex].isPlaying = false;

        this.currentPlayingIndex++;
        if (this.currentPlayingIndex < total) {
            this.dataStore.playlist[this.currentPlayingIndex].isPlaying = true;
            this.play(this.dataStore.playlist[this.currentPlayingIndex]);
        }

        this.updatePlaylistSubscribers();
    }

    previous() {
        var total = this.dataStore.playlist.length;
        if (total === 0) {
            return;
        }

        this.dataStore.playlist[this.currentPlayingIndex].hasBeenPlayed = true;
        this.dataStore.playlist[this.currentPlayingIndex].isPlaying = false;

        this.currentPlayingIndex--;
        if (this.currentPlayingIndex > -1) {
            this.dataStore.playlist[this.currentPlayingIndex].isPlaying = true;
            this.play(this.dataStore.playlist[this.currentPlayingIndex]);
        }

        this.updatePlaylistSubscribers();
    }


    playPlayListItem(index) {
        var total = this.dataStore.playlist.length;
        if (total === 0) {
            return;
        }

        this.dataStore.playlist[this.currentPlayingIndex].hasBeenPlayed = true;
        this.dataStore.playlist[this.currentPlayingIndex].isPlaying = false;

        this.currentPlayingIndex = index;
        if (this.currentPlayingIndex > -1) {
            this.dataStore.playlist[this.currentPlayingIndex].isPlaying = true;
            this.play(this.dataStore.playlist[this.currentPlayingIndex]);
        }

        this.updatePlaylistSubscribers();
    }


    play(item: PlaylistItem) {
        this.player$.next(item);
    }

    clear(){
        this.dataStore.playlist = [];
        this.updatePlaylistSubscribers();

    }


    private updatePlaylistSubscribers() {
        this.playList$.next(this.dataStore.playlist);
    }

}
