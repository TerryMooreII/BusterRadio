import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'br-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {

    currentTime: number = 0;
    duration: number = 0;

    constructor() {
    }

    ngOnInit() {
    }

    setDuration(time) {
        this.duration = time;
    }

    setCurrentTime(time) {
        this.currentTime = time;
    }

    percent() {
        if (!this.currentTime || !this.duration) {
            return 0;
        }
        return (this.currentTime / this.duration * 100) + '%';
    }

}
