import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {CacheService} from "../services/cache/cache.service";
import {ArchiveService} from "../services/archive/archive.service";

@Component({
    selector: 'br-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.less']
})
export class SearchResultsComponent implements OnInit {

    artistsList: any;
    shows: any;

    constructor(private route: ActivatedRoute, private cache: CacheService, private archiveService: ArchiveService) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let query = params['query'];

            this.getArtists(query);
            this.getVenues(query);
        });
    }

    getArtists(query) {
        this.artistsList = this.cache.getArtists(query);

        if (!this.artistsList) {
            setTimeout(() => {
                this.getArtists(query);
            }, 100);
        } else {
            this.artistsList = this.cache.getArtists(query);

        }
    }

    getVenues(query){
        this.archiveService.getVenues(query).subscribe((response) => {
            this.shows = response._body.response.docs;
        });
    }





}
