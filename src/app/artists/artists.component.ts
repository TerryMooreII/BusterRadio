import {Component, OnInit} from '@angular/core';
import {ArchiveService} from "../services/archive/archive.service";
import {Params, ActivatedRoute} from "@angular/router";
import {CacheService} from "../services/cache/cache.service";

@Component({
    selector: 'br-artists',
    templateUrl: './artists.component.html',
    styleUrls: ['./artists.component.less']
})
export class ArtistsComponent implements OnInit {

    artistsList: any;

    constructor(private archiveService: ArchiveService, private route: ActivatedRoute, private cache: CacheService) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let query = params['query'];
            this.getArtists(query);
        });
    }

    getArtists(query) {
        this.artistsList = this.cache.getArtists(query);

        if (this.artistsList.length === 0){
            this.archiveService.loadArtists().subscribe(data => {
                this.cache.setArtistsCache(data._body.response.docs);
                this.artistsList = this.cache.getArtists();
            });
        }
    }

}
