import {Injectable} from '@angular/core';
import {PlaylistItem} from '../../models/playlistItem';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import { Subscription} from 'rxjs/Subscription';
import {RecentService} from '../recent/recent.service';
import {AngularFire} from 'angularfire2';
import {NullifyService} from '../nullify/nullify.service';

@Injectable()
export class PlaylistService {

    private playList$: BehaviorSubject<PlaylistItem[]>;
    private dataStore: {
        playlist: PlaylistItem[]
    };
    private player$: Subject<PlaylistItem>;
    private currentPlayingIndex: number;

    private isShuffle = false;
    private isRepeat = false;

    private afQueue;
    private afQueueObs$: Subscription;

    constructor(private recentService: RecentService, private af: AngularFire, private nullify: NullifyService) {

        this.playList$ = <BehaviorSubject<PlaylistItem[]>>new BehaviorSubject([]);
        this.player$ = new Subject<PlaylistItem>();


        this.af.auth.subscribe(user => {
            if (!user && this.afQueueObs$) {
                this.afQueue = null;
                this.afQueueObs$.unsubscribe();
            }

            this.getSavedPlaylist(user);
        });
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
                const play = index === this.currentPlayingIndex && playIndex != null;
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
        this.dataStore.playlist[this.currentPlayingIndex].isCurrent = false;

        this.currentPlayingIndex = this.isShuffle ? this.getRandomTrack() : this.currentPlayingIndex + 1;

        if (this.isRepeat && this.currentPlayingIndex === total) {
            this.currentPlayingIndex = 0;
        }

        if (this.currentPlayingIndex < total) {
            this.dataStore.playlist[this.currentPlayingIndex].isCurrent = true;
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
        this.dataStore.playlist[this.currentPlayingIndex].isCurrent = false;

        this.currentPlayingIndex = this.isShuffle ? this.getRandomTrack() : this.currentPlayingIndex - 1;

        if (this.currentPlayingIndex > -1) {
            this.dataStore.playlist[this.currentPlayingIndex].isCurrent = true;
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
            this.dataStore.playlist[this.currentPlayingIndex].isCurrent = false;
        }

        this.currentPlayingIndex = index;

        if (this.currentPlayingIndex > -1) {
            this.dataStore.playlist[this.currentPlayingIndex].isCurrent = true;
            this.play(this.dataStore.playlist[this.currentPlayingIndex]);
        }

        this.updatePlaylistSubscribers();
    }


    play(item: PlaylistItem) {
        this.player$.next(item);
        this.recentService.addRecentTrack(item);
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
        if (this.afQueue) {
            this.afQueue.set({playlist: this.nullify.nullify(playList)});
        } else {
            localStorage.setItem('playlist', JSON.stringify(playList));
        }
    }

    getSavedPlaylistFromLocalStorage() {
        const pl = localStorage.getItem('playlist');
        let data;
        if (pl) {
            try {
                data = JSON.parse(pl).map((data) => {
                    data.isCurrent = false;
                    return data;
                });
            } catch (e) {
                data = [];
            }
        }
        this.dataStore = {playlist: data};
        this.updatePlaylistSubscribers();
    }

    getSavePlayListFromDatabase(user) {

        this.afQueue = this.af.database.object('/queue/' + user.uid);
        this.afQueueObs$ = this.afQueue.subscribe(data => {
            this.dataStore = {playlist: data.playlist || []};
            this.updatePlaylistSubscribers();
        });
    }

    getSavedPlaylist(user) {
        if (!user) {
            this.getSavedPlaylistFromLocalStorage();
        } else {
            this.getSavePlayListFromDatabase(user);
        }
    }

}

