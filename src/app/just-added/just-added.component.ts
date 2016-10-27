import {Component, OnInit} from '@angular/core';
import {ArchiveService} from "../services/archive/archive.service";
import {CacheService} from "../services/cache/cache.service";

@Component({
    selector: 'br-just-added',
    templateUrl: './just-added.component.html',
    styleUrls: ['./just-added.component.less']
})
export class JustAddedComponent implements OnInit {

    constructor(private archiveService: ArchiveService, private cache:CacheService) {
    }

    ngOnInit() {
        this.archiveService.loadArtists().subscribe(data => {
            this.cache.setArtistsCache(data._body.response.docs);
            console.log('loaded');
        });
    }

}
