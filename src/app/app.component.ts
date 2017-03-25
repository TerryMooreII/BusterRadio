import {Component, OnInit} from "@angular/core";
import {CacheService} from "./services/cache/cache.service";
import {NavigationEnd, Router} from "@angular/router";


declare let ga: Function;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

    show = true;

    constructor(private cache: CacheService, public router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                ga('set', 'page', event.urlAfterRedirects);
                ga('send', 'pageview');
            }
        });
    }

    ngOnInit() {
        // Checks to see if the CanActivate call is completed.
        let interval;
        interval = setInterval(() => {
            if (this.cache.getArtists()) {
                this.show = false;
                clearInterval(interval);
            }
        }, 100);
    }
}
