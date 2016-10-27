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

    audioElement:any;
    isPlaying:boolean;

    constructor(private playlist: PlaylistService) {
    }

    ngOnInit() {
        this.audioElement = document.createElement('audio');
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
        this.onSongEnd();
        this.timeupdate();
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
            this.next();
        });
    }

    play() {
        this.isPlaying = true;
        this.audioElement.play();
    }

    pause(){
        this.isPlaying = false;
        this.audioElement.pause();
    }

    next() {
        this.pause();
        this.playlist.next();
    }

    previous() {
        this.pause();
        this.playlist.previous();
    }

}

