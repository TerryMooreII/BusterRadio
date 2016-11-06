import {Component, ChangeDetectorRef} from '@angular/core';
import {CacheService} from "./services/cache/cache.service";
import {ArchiveService} from "./services/archive/archive.service";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {

    constructor(private archiveService: ArchiveService, private cache: CacheService, private router: Router) {
    }

    ngOnInit() {
        this.archiveService.loadArtists().subscribe(data => {
            this.cache.setArtistsCache(data._body.response.docs);
        });
    }

    randomShow(){
        let artists = this.cache.getArtists();

        let artist = artists[Math.floor(Math.random() * artists.length)];

        this.archiveService.getShows(artist.identifier).subscribe((response) =>{
            let shows = response._body.response.docs;
            if (shows.length === 0){
                this.randomShow();
                return;
            }
            let show = shows[Math.floor(Math.random() * shows.length)];
            this.router.navigate(['/artists', artist.identifier, 'years', show.year, 'shows', show.identifier]);

        })
    }
}
