import {Component, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {CacheService} from "../services/cache/cache.service";
import {LiveService} from "../services/live/live.service";

@Component({
    selector: 'br-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.less']
})
export class LiveComponent implements OnInit {

    tracks: any;

    constructor(private liveService: LiveService, private cache: CacheService, private af:AngularFire) {
    }


    ngOnInit() {
        this.tracks = this.liveService.list();
    }

    bandImage(artist) {
        if (!artist) {
            return '';
        }
        const url = '//archive.org/services/img/' + this.cache.getIdentifierByArtist(artist);
        return url;

    }
}
