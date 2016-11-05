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

    search: FormControl = new FormControl();

    constructor(private archiveService: ArchiveService, private cache: CacheService, private router: Router) {
        this.search.valueChanges
         .debounceTime(400)
            .subscribe(term => {
                if (term){
                    this.router.navigate(['/artists', {query: term}]);
                }

            })
    }

    ngOnInit() {
        this.archiveService.loadArtists().subscribe(data => {
            this.cache.setArtistsCache(data._body.response.docs);
        });
    }

    clear(){
        this.search.setValue(null);
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
