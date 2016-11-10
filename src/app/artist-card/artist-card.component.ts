import {Component, OnInit} from '@angular/core';
import {Input} from "@angular/core/src/metadata/directives";
import {ArchiveService} from "../services/archive/archive.service";

@Component({
    selector: 'br-artist-card',
    templateUrl: './artist-card.component.html',
    styleUrls: ['./artist-card.component.less']
})
export class ArtistCardComponent implements OnInit {

    @Input() artist;

    constructor(private archiveService:ArchiveService) {
    }

    ngOnInit() {
    }

    bandImage(artist) {
        return this.archiveService.bandImage(artist);
    }

}
