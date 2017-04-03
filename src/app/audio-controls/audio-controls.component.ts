import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {PlaylistService} from '../services/playlist/playlist.service';
import {AngularFire} from 'angularfire2';
import {LiveService} from '../services/live/live.service';
import {QueueManagerService} from '../services/queue-manager/queue-manager.service';


@Component({
    selector: 'br-audio-controls',
    templateUrl: './audio-controls.component.html',
    styleUrls: ['./audio-controls.component.less']
})
export class AudioControlsComponent implements OnInit {

    @Output() duration = new EventEmitter<any>();
    @Output() currentTime = new EventEmitter<any>();

    @Input() newCurrentTime: EventEmitter<number>;

    audioElement: any;
    isPlaying: boolean;
    isDisabled: boolean = true;

    isRepeatSingle: boolean;
    isRepeat: boolean;
    isShuffle: boolean;

    live: any;

    constructor(private playlist: PlaylistService, private liveService: LiveService, private queueManager: QueueManagerService) {


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

        this.queueManager.getCurrentTrack().subscribe(current => {
            if (current.isPlaying) {
                this.play();
            } else {
                this.pause();
            }
        });
        // Watch for newCurrentTime updates and set current time
        this.newCurrentTime.subscribe((data) => this.audioElement.currentTime = data);
    }

    setAudioSrc(item) {
        this.isDisabled = !item;
        const track = item.track;
        this.queueManager.setTrack(track);
        const url = '//www.archive.org/download/' + track.identifier + track.fileName;

        this.liveService.add(track);

        this.audioElement.setAttribute('src', url);

        this.queueManager.isPlaying(true);
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
                this.queueManager.isPlaying(true);
            } else {
                this.next();
            }
        });
    }

    playPauseToggle() {
        this.isPlaying ? this.queueManager.isPlaying(false) : this.queueManager.isPlaying(true);
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

