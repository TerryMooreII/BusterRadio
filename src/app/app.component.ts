import {Component, ChangeDetectorRef, OnInit} from '@angular/core';
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
export class AppComponent implements OnInit {

    show: boolean = true;

    constructor(private cache: CacheService) {
    }

    ngOnInit() {
        //Checks to see if the CanActivate call is completed.
        var interval;
        interval = setInterval(() => {
                if (this.cache.getArtists()) {
                    this.show = false;
                    clearInterval(interval);
                }
            },100);
    }
}
