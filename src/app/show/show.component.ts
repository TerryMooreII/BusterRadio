import {Component, OnInit} from "@angular/core";
import {Params, ActivatedRoute} from "@angular/router";
import {ArchiveService} from "../services/archive/archive.service";
import {Show} from "../models/show";
import {PlaylistService} from "../services/playlist/playlist.service";
import {CacheService} from "../services/cache/cache.service";

@Component({
    selector: 'br-show',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.less']
})

export class ShowComponent implements OnInit {

    constructor(private route: ActivatedRoute, private archiveService: ArchiveService, private playlist: PlaylistService, private cache:CacheService) {
    }

    show: Show;
    isLoading:boolean = false;

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let identifier = params['show'];
            this.getShow(identifier);

        });
    }

    getShow(identifier) {
        this.isLoading = true;
        this.archiveService.getShow(identifier).subscribe(response => {
            this.show = new Show(response._body);
            this.bandImage();
            this.isLoading = false;
        });
    }

    play(tracks, playIndex) {
        this.playlist.add(tracks, playIndex);
    }

    addToPlaylist(track){
        this.playlist.add(track);
    }

    getIdentifierByArtist(artist){
        return this.cache.getIdentifierByArtist(artist);
    }

    parseTitle(show) {
        if (!show || !show.title) {
            return null;
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

    bandImage(){
        if (!this.show){
            return ''
        }
        return 'http://archive.org/services/img/' + this.cache.getIdentifierByArtist(this.show.artist);;
    }

}
