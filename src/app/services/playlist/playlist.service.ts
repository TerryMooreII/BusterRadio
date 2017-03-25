import {Injectable} from '@angular/core';
import {PlaylistItem} from "../../models/playlistItem";
import {Subject, BehaviorSubject, Observable} from "rxjs";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {NullifyService} from "../nullify/nullify.service";

@Injectable()
export class PlaylistService {

    private playList$: BehaviorSubject<PlaylistItem[]>;
    private dataStore: {
        playlist: PlaylistItem[]
    };
    private player$: Subject<PlaylistItem>;
    private currentPlayingIndex: number;

    private isShuffle: boolean = false;
    private isRepeat: boolean = false;

    private user;

    constructor(private af: AngularFire, private nullify: NullifyService) {
        this.dataStore = {playlist: this.getSavedPlaylist()};
        this.playList$ = <BehaviorSubject<PlaylistItem[]>>new BehaviorSubject([]);
        this.player$ = new Subject<PlaylistItem>();
        this.updatePlaylistSubscribers();


        this.af.auth.asObservable().subscribe(user => this.user = user);
    }

    getPlaylist() {
        return this.playList$.asObservable();
    }

    getPlayer() {
        return this.player$.asObservable();
    }

    add(tracks, playIndex?) {
        if (playIndex != null) {
            this.currentPlayingIndex = playIndex;
        }

        if (Array.isArray(tracks)) {

            const list = tracks.map((track, index) => {
                const play = index === this.currentPlayingIndex && playIndex != null ? true : false;
                const playlistItem = new PlaylistItem(track, play);
                if (play && playIndex != null) {
                    this.play(playlistItem);
                }

                return playlistItem;
            });

            if (playIndex != null) {
                this.dataStore.playlist = list;
            } else {
                this.dataStore.playlist = this.dataStore.playlist.concat(list);
            }

        } else {
            this.dataStore.playlist.push(new PlaylistItem(tracks, false));
        }
        this.updatePlaylistSubscribers();
    }

    next() {
        const total = this.dataStore.playlist.length;
        if (total === 0 || (this.currentPlayingIndex === (total - 1) && !this.isRepeat)) {
            return;
        }

        this.dataStore.playlist[this.currentPlayingIndex].hasBeenPlayed = true;
        this.dataStore.playlist[this.currentPlayingIndex].isPlaying = false;

        this.currentPlayingIndex = this.isShuffle ? this.getRandomTrack() : this.currentPlayingIndex + 1;

        if (this.isRepeat && this.currentPlayingIndex === total) {
            this.currentPlayingIndex = 0;
        }

        if (this.currentPlayingIndex < total) {
            this.dataStore.playlist[this.currentPlayingIndex].isPlaying = true;
            this.play(this.dataStore.playlist[this.currentPlayingIndex]);
        }

        this.updatePlaylistSubscribers();
    }

    previous() {
        const total = this.dataStore.playlist.length;
        if (total === 0 || this.currentPlayingIndex === 0) {
            return;
        }

        this.dataStore.playlist[this.currentPlayingIndex].hasBeenPlayed = true;
        this.dataStore.playlist[this.currentPlayingIndex].isPlaying = false;

        this.currentPlayingIndex = this.isShuffle ? this.getRandomTrack() : this.currentPlayingIndex - 1;

        if (this.currentPlayingIndex > -1) {
            this.dataStore.playlist[this.currentPlayingIndex].isPlaying = true;
            this.play(this.dataStore.playlist[this.currentPlayingIndex]);
        }

        this.updatePlaylistSubscribers();
    }


    playPlayListItem(index) {
        const total = this.dataStore.playlist.length;
        if (total === 0) {
            return;
        }

        if (this.currentPlayingIndex != null) {
            this.dataStore.playlist[this.currentPlayingIndex].hasBeenPlayed = true;
            this.dataStore.playlist[this.currentPlayingIndex].isPlaying = false;
        }

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

    clear() {
        this.dataStore.playlist = [];
        this.updatePlaylistSubscribers();
    }

    shuffle(isShuffle) {
        this.isShuffle = isShuffle;
    }

    repeat(isRepeat) {
        this.isRepeat = isRepeat;
    }

    getRandomTrack() {
        const total = this.dataStore.playlist.length;
        return Math.floor(Math.random() * total);
    }


    private updatePlaylistSubscribers() {
        this.playList$.next(this.dataStore.playlist);
        this.savePlaylist(this.dataStore.playlist);
    }

    savePlaylist(playList) {
        localStorage.setItem('playlist', JSON.stringify(playList));
    }

    getSavedPlaylist() {
        const pl = localStorage.getItem('playlist');

        if (pl) {
            try {
                return JSON.parse(pl).map((data) => {
                    data.isPlaying = false;
                    return data;
                });
            } catch (e) {
                return [];
            }
        }
    }

    newPlaylist(playlist) {
        playlist.type = 'named';
        playlist.uid = this.user.uid;

        this.af.database.list('/playlists').push(this.nullify.nullify(playlist));
    }


}
