import {Component, OnInit} from '@angular/core';
import {ArchiveService} from "../services/archive/archive.service";
import {ActivatedRoute, Params} from "@angular/router";
import {CacheService} from "../services/cache/cache.service";

@Component({
    selector: 'br-shows',
    templateUrl: './shows.component.html',
    styleUrls: ['./shows.component.less']
})
export class ShowsComponent implements OnInit {
    shows: Array<any>;
    years: any;
    artist: String;

    constructor(private archiveService: ArchiveService, private route: ActivatedRoute, private cache: CacheService) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let artist = params['artist'];

            let year = params['year'];
            this.getShows(artist, year);
            this.artist = this.cache.getArtistByIdentifier(artist);
        });
    }

    getShows(artist: String, year: String) {
        this.shows = this.cache.getShows(artist, year);


        if (!this.shows) {
            this.archiveService.getShows(artist).subscribe(data => {
                this.shows = data._body.response.docs;
                this.years = new Set(this.shows.map(item => item.year));
                this.cache.setShows(artist, this.shows);
                this.cache.setYears(artist, this.years);
            });
        }

    }

    getDate(date) {
        return date.substr(0, 10);
    }

    parseVenue(show) {
        if (!show || !show.title) {
            return 'Unknown';
        }

        let rep = new RegExp("\\at\\s(.*?)\\son").exec(show.title);
        if (rep && rep.length && rep.length >= 1) {
            return rep[1];
        }
        return 'Unknown'
    }
}
