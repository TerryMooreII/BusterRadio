import {Component, OnInit} from '@angular/core';
import {PlaylistService} from "../services/playlist/playlist.service";
import {PlaylistItem} from "../models/playlistItem";

@Component({
    selector: 'br-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.less']
})
export class PlaylistComponent implements OnInit {

    playlist:Array<PlaylistItem>;

    constructor(private playlistService: PlaylistService) {
        this.playlist = [];
    }

    ngOnInit() {
        this.playlistService.getPlaylist().subscribe(data => {
            this.playlist = data;
            console.log(data)
        })
    }

}
