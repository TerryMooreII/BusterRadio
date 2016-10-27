import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'br-stars',
    templateUrl: './stars.component.html',
    styleUrls: ['./stars.component.less']
})
export class StarsComponent implements OnInit {
    @Input() stars: String;

    fullStars: Array<any>;
    emptyStars: Array<any>;
    halfStar: boolean;

    constructor() {
    }

    ngOnInit() {
        if (this.stars.indexOf('.5') > -1){
            this.halfStar = true;
        }

        this.fullStars = new Array(parseInt(this.stars.replace('.5', ''), 10));
        this.emptyStars = new Array(5 - (this.fullStars.length + (this.halfStar ? 1 : 0)));
    }


}
