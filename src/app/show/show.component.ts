import {Component, OnInit} from '@angular/core';
import {Params, ActivatedRoute} from "@angular/router";
import {ArchiveService} from "../services/archive/archive.service";
import {Show} from "../models/show";
import {PlaylistService} from "../services/playlist/playlist.service";

@Component({
    selector: 'br-show',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.less']
})
export class ShowComponent implements OnInit {

    constructor(private route: ActivatedRoute, private archiveService: ArchiveService, private playlist: PlaylistService) {
    }

    show: Show;

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let identifier = params['show'];

            this.getShow(identifier);
        });
    }

    getShow(identifier) {
        this.archiveService.getShow(identifier).subscribe(response => {
            this.show = new Show(response._body);
            console.log(this.show)
            console.log(this.parseTitle(this.show));
        });
    }

    play(tracks, playIndex) {
        this.playlist.add(tracks, playIndex);
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
