import {Component, OnInit} from "@angular/core";
import {Params, ActivatedRoute} from "@angular/router";
import {CacheService} from "../services/cache/cache.service";
import {ArchiveService} from "../services/archive/archive.service";

@Component({
    selector: 'br-artists',
    templateUrl: './artists.component.html',
    styleUrls: ['./artists.component.less']
})
export class ArtistsComponent implements OnInit {

    artistsList: any;
    num: number = 20;
    letters: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    showLetters: boolean = true;

    constructor(private route: ActivatedRoute, private cache: CacheService, private archiveService: ArchiveService) {
    }

    ngOnInit() {


        this.route.params.forEach((params: Params) => {
            let query = params['query'];
            let starts = params['starts'];
            let count = params['count'];

            if (count) {
                this.getTopDownloadedArtists(count);
                this.showLetters = false;
                return;
            }
            this.getArtists(query, starts);
        });
    }

    getArtists(query, starts) {
        this.artistsList = this.cache.getArtists(query);

        if (!this.artistsList) {
            setTimeout(() => {
                this.getArtists(query, starts);
            }, 100);
        }else{

            if (starts) {
                this.artistsList = this.cache.getArtists().filter((data) => {
                    return data.title.substr(0, 1).toUpperCase() === starts;
                });
            } else {
                this.artistsList = this.cache.getArtists(query);
            }
        }
    }

    getTopDownloadedArtists(count) {
        //count = !isNan(count) || 50;
        this.archiveService.topDownloadedArtists(count).subscribe((data)=> {
            this.artistsList = data.splice(1);
        });
    }

    currentPos(pos) {
        this.num = this.num + 20;
    }

    bandImage(artist) {
        return 'http://archive.org/services/img/' + artist;
    }

}
