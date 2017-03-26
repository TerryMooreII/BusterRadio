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
    isLoading:boolean;
    artistObj;

    constructor(private archiveService: ArchiveService, private route: ActivatedRoute, private cache: CacheService) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            const artistId = params['artist'];
            const year = params['year'];
            this.getShows(artistId, year);
            this.artist = this.cache.getArtistByIdentifier(artistId);
            this.artistObj = {
                title: this.artist,
                identifier: artistId
            };
        });
    }

    getShows(artist: String, year: String) {
        this.shows = this.cache.getShows(artist, year);

        if (!this.shows) {
            this.isLoading = true;
            this.archiveService.getShows(artist).subscribe(data => {
                let shows = data._body.response.docs;
                let years = new Set(shows.map(item => item.year));
                this.cache.setShows(artist, shows);
                this.cache.setYears(artist, years);
                this.shows = this.cache.getShows(artist, year);
                this.isLoading = false;
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
