import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {PlaylistService} from "../services/playlist/playlist.service";

@Component({
    selector: 'br-audio-controls',
    templateUrl: './audio-controls.component.html',
    styleUrls: ['./audio-controls.component.less']
})
export class AudioControlsComponent implements OnInit {

    @Output() duration = new EventEmitter<any>();
    @Output() currentTime = new EventEmitter<any>();

    audioElement: any;
    isPlaying: boolean;

    isRepeatSingle: boolean;
    isRepeat: boolean;
    isShuffle: boolean;

    constructor(private playlist: PlaylistService) {
    }

    ngOnInit() {
        this.audioElement = document.createElement('audio');
        this.onSongEnd();
        this.timeupdate();

        this.isPlaying = false;

        this.playlist.getPlayer().subscribe(data => {
            this.pause();
            this.setAudioSrc(data);
        });
    }

    setAudioSrc(item) {
        let track = item.track;
        let url = 'http://www.archive.org/download/' + track.identifier + track.fileName;
        this.audioElement.setAttribute('src', url);
        this.play();
    }

    timeupdate() {
        this.audioElement.addEventListener('timeupdate', () => {
            this.duration.emit(this.audioElement.duration);
            this.currentTime.emit(this.audioElement.currentTime);
        });
    }

    onSongEnd() {
        this.audioElement.addEventListener('ended', () => {
            if (this.isRepeatSingle) {
                this.audioElement.currentTime = 0;
                this.play();
            } else {
                this.next();
            }
        });
    }

    playPauseToggle() {
        this.isPlaying ? this.pause() : this.play();
    }

    play() {
        this.isPlaying = true;
        this.audioElement.play();
    }

    pause() {
        this.isPlaying = false;
        this.audioElement.pause();
    }

    next() {
        this.playlist.next();
    }

    previous() {
        this.playlist.previous();
    }

    repeatToggle() {

        if (!this.isRepeat && !this.isRepeatSingle) {
            this.isRepeat = true;
        } else if (this.isRepeat && !this.isRepeatSingle) {
            this.isRepeat = false;
            this.isRepeatSingle = true;
        } else {
            this.isRepeatSingle = false;
            this.isRepeat = false;
        }
        this.playlist.repeat(this.isRepeat);
    }

    shuffle() {
        this.isShuffle = !this.isShuffle;
        this.playlist.shuffle(this.isShuffle);
    }

}
