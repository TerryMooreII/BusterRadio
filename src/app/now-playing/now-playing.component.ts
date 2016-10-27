import { Component, OnInit } from '@angular/core';
import {PlaylistService} from "../services/playlist/playlist.service";
import {Track} from "../models/show";

@Component({
  selector: 'br-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.less']
})
export class NowPlayingComponent implements OnInit {

    track: Track;

    constructor(private playlist: PlaylistService) {
    }

    ngOnInit() {

        this.playlist.getPlayer().subscribe(data => {
            this.track = data.track;
        });

    }


}
