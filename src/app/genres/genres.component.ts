import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'br-genres',
    templateUrl: './genres.component.html',
    styleUrls: ['./genres.component.less']
})
export class GenresComponent implements OnInit {


    genres:Array<string> = ['Rock','Indie','Jam Band','Funk','Pop','Acoustic','Alternative','Bluegrass','Progressive','Soul','Country','Folk Rock','Blues','Jazz', 'Electronic', 'Americana','Folk','Psychedelic','Punk', 'Rap', 'Experimental','Fusion','Hip Hop','R&B','Roots Music','Southern Rock','Crunk','Jam','Reggae','Classic Rock','Progressive','Ambient','Dub','Garage','Hardcore','Trance','Surf','Techno'];

    constructor() {
        this.genres.sort();
    }

    ngOnInit() {
    }

}
