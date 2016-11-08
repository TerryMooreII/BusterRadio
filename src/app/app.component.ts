import {Component, ChangeDetectorRef} from '@angular/core';
import {CacheService} from "./services/cache/cache.service";
import {ArchiveService} from "./services/archive/archive.service";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {

    constructor(private archiveService: ArchiveService, private cache: CacheService) {
    }

    ngOnInit() {
        this.archiveService.loadArtists().subscribe(data => {
            this.cache.setArtistsCache(data._body.response.docs);
        });
    }
}
