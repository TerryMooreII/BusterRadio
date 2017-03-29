import {Component, OnInit} from '@angular/core';
import {ArchiveService} from '../services/archive/archive.service';
import {CacheService} from '../services/cache/cache.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
    selector: 'br-side-nav-menu',
    templateUrl: './side-nav-menu.component.html',
    styleUrls: ['./side-nav-menu.component.less']
})
export class SideNavMenuComponent implements OnInit {

    totalArtists: number;

    constructor(private archiveService: ArchiveService, private cache: CacheService, private router: Router) {
    }

    ngOnInit() {
         this.archiveService.getTotalArtists().subscribe(response => {
             this.totalArtists = response._body.response.numFound;
         });

    }

    randomShow() {
        const artists = this.cache.getArtists();

        const artist = artists[Math.floor(Math.random() * artists.length)];

        this.archiveService.getShows(artist.identifier).subscribe((response) => {
            const shows = response._body.response.docs;
            if (shows.length === 0) {
                this.randomShow();
                return;
            }
            const show = shows[Math.floor(Math.random() * shows.length)];
            this.router.navigate(['/artists', artist.identifier, 'years', show.year, 'shows', show.identifier]);

        });
    }


}
