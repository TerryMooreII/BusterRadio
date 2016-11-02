import {Component, OnInit} from "@angular/core";
import {Params, ActivatedRoute} from "@angular/router";
import {CacheService} from "../services/cache/cache.service";

@Component({
    selector: 'br-artists',
    templateUrl: './artists.component.html',
    styleUrls: ['./artists.component.less']
})
export class ArtistsComponent implements OnInit {

    artistsList: any;
    num:number = 20;

    constructor(private route: ActivatedRoute, private cache: CacheService) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let query = params['query'];
            this.getArtists(query);
        });
    }

    getArtists(query) {
        this.artistsList = this.cache.getArtists(query);

        if (!this.artistsList){
            setTimeout(() =>{
                this.getArtists(query);
            }, 100);
        }
    }

    currentPos(pos){
        this.num = this.num + 20;
    }

    bandImage(artist){
        return 'http://archive.org/services/img/' + artist;
    }

}
