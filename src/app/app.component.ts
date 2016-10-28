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
        // .distinctUntilChanged()
            .subscribe(term => {
                console.log(term);
                this.router.navigate(['/artists', {query: term}])
            })
    }

    ngOnInit() {
        this.archiveService.loadArtists().subscribe(data => {
            this.cache.setArtistsCache(data._body.response.docs);
            console.log('loaded');
        });


    }
}
