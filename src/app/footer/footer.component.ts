import {Component, OnInit, ElementRef} from '@angular/core';

@Component({
    selector: 'br-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {

    currentTime: number = 0;
    duration: number = 0;
    userSetting:number;

    constructor(private el:ElementRef) {
    }

    ngOnInit() {
    }

    setDuration(time) {
        this.duration = time;
    }

    setCurrentTime(time) {
        this.currentTime = time;
    }

    percent():String {
        // if (this.userSetting){
        //     return this.userSetting + '%';
        // }

        if (!this.currentTime || !this.duration) {
            return '0';
        }
        return (this.currentTime / this.duration * 100) + '%';
    }

    dotPercent():String {
        // if (this.userSetting){
        //     return this.userSetting + '%';
        // }
        if (!this.currentTime || !this.duration) {
            return '0';
        }
        return (((this.currentTime - 1) / this.duration) * 100) + '%';
    }

    getPosition(event){
        return;
        // var elWidth = this.el.nativeElement.offsetWidth;
        // var clicked = (event.offsetX);
        // this.userSetting = clicked / elWidth * 100;
    }


}
