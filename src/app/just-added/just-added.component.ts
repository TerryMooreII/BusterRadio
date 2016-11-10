import {Component, OnInit} from "@angular/core";
import {ArchiveService} from "../services/archive/archive.service";
import {CacheService} from "../services/cache/cache.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
    selector: 'br-just-added',
    templateUrl: './just-added.component.html',
    styleUrls: ['./just-added.component.less']
})
export class JustAddedComponent implements OnInit {

    shows: any;
    currentType:string;
    title:string;

    constructor(private archiveService: ArchiveService, private cache: CacheService, private route:ActivatedRoute) {
    }

    ngOnInit() {

        this.route.params.forEach((params: Params) => {
            let sort = params['sort'];

            if (sort === 'date'){
                this.getLatest('date');
                this.title = 'Newest Shows by Date';
            }else{
                this.getLatest('publicdate');
                this.title = 'Newest Added Shows';
            }
        });
    }

    getLatest(type){
        if (this.currentType === type){
            return;
        }

        this.currentType = type;
        this.archiveService.getNewestShows(32, type)
            .subscribe((response) => {
                this.shows = response._body.response.docs;
            });

    }
}
