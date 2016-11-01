import { Component, OnInit } from '@angular/core';
import {Params, ActivatedRoute} from "@angular/router";
import {ArchiveService} from "../services/archive/archive.service";
import {CacheService} from "../services/cache/cache.service";
import {cache} from "rxjs/operator/cache";

@Component({
  selector: 'br-years',
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.less']
})
export class YearsComponent implements OnInit {

    shows: Array<any>;
    artist:String;
    years: any;

    constructor(private archiveService: ArchiveService, private route: ActivatedRoute, private cache: CacheService) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let artist = params['artist'];
            let year = params['year'];
            this.getShows(artist);
            this.artist = this.cache.getArtistByIdentifier(artist);
        });
    }

    getShows(artist: String) {
        this.years = this.cache.getYears(artist);

        if (!this.years) {
            this.archiveService.getShows(artist).subscribe(data => {
                this.shows = data._body.response.docs;
                this.years = new Set(this.shows.map(item => item.year));
                this.cache.setShows(artist, this.shows);
                this.cache.setYears(artist, this.years);
            });
        }
    }

}
