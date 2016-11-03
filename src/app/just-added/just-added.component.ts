import {Component, OnInit} from "@angular/core";
import {ArchiveService} from "../services/archive/archive.service";
import {CacheService} from "../services/cache/cache.service";

@Component({
    selector: 'br-just-added',
    templateUrl: './just-added.component.html',
    styleUrls: ['./just-added.component.less']
})
export class JustAddedComponent implements OnInit {

    shows: any;

    constructor(private archiveService: ArchiveService, private cache: CacheService) {
    }

    ngOnInit() {

        this.archiveService.getNewestShows(32)
            .subscribe((response) => {
                this.shows = response._body.response.docs;
            });
    }

    bandImage(artist) {
        if (!artist) {
            return ''
        }
        return 'http://archive.org/services/img/' + this.cache.getIdentifierByArtist(artist);
    }

    showRoute(show) {
        return ['/artists/', this.cache.getIdentifierByArtist(show.creator), 'years', show.year, 'shows', show.identifier]
    }
}
