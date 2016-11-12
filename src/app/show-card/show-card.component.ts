import {Component, OnInit} from '@angular/core';
import {ArchiveService} from "../services/archive/archive.service";
import {CacheService} from "../services/cache/cache.service";
import {Input} from "@angular/core/src/metadata/directives";

@Component({
    selector: 'br-show-card',
    templateUrl: './show-card.component.html',
    styleUrls: ['./show-card.component.less']
})
export class ShowCardComponent implements OnInit {

    @Input() show;

    constructor(private archiveService: ArchiveService, private cache:CacheService) { }

    ngOnInit() {
    }

    showRoute(show) {
        return ['/artists/', this.cache.getIdentifierByArtist(show.creator), 'years', show.year, 'shows', show.identifier]
    }

    bandImage(artist) {
        return this.archiveService.bandImage(this.cache.getIdentifierByArtist(artist));
    }

    getVenue(title){
        if (!title){
            return '';
        }

        var venue = title.split(' at ');

        if (venue.length > 0){
            return ''
        }

        return venue[1].split(' on ')[0];
    }

}
