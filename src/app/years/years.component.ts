import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {ArchiveService} from '../services/archive/archive.service';
import {CacheService} from '../services/cache/cache.service';

@Component({
    selector: 'br-years',
    templateUrl: './years.component.html',
    styleUrls: ['./years.component.less']
})
export class YearsComponent implements OnInit {

    shows: Array<any>;
    artist: string;
    artistObj: any;
    years: any;
    isLoading = false;

    constructor(private archiveService: ArchiveService,
                private route: ActivatedRoute,
                private cache: CacheService) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            const artistId = params['artist'];
            const year = params['year'];
            this.getShows(artistId);
            this.artist = this.cache.getArtistByIdentifier(artistId);

            this.artistObj = {
                title: this.artist,
                identifier: artistId
            };

        });
    }

    getShows(artist: String) {

        this.years = this.cache.getYears(artist);

        if (!this.years) {
            this.isLoading = true;
            this.archiveService.getShows(artist).subscribe(data => {
                this.shows = data._body.response.docs;
                this.years = new Set(this.shows.map(item => {
                    if (item.year.length === 4){
                        return item.year;
                    }
                    return false;
                }));
                this.years.delete(false);
                this.cache.setShows(artist, this.shows);
                this.cache.setYears(artist, this.years);
                this.isLoading = false;
            });
        }
    }

}
