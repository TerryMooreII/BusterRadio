import {Component, OnInit, ElementRef, EventEmitter} from '@angular/core';
import {Output} from "@angular/core/src/metadata/directives";

@Component({
    selector: 'br-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {

    @Output() newCurrentTime = new EventEmitter<number>();

    currentTime: number = 0;
    duration: number = 0;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
    }

    setDuration(time) {
        this.duration = time;
    }

    setCurrentTime(time) {
        this.currentTime = time;
    }

    percent(): String {
        if (!this.currentTime || !this.duration) {
            return '0';
        }
        return (this.currentTime / this.duration * 100) + '%';
    }

    dotPercent(): String {
        if (!this.currentTime || !this.duration) {
            return '0';
        }
        return (((this.currentTime - 1) / this.duration) * 100) + '%';
    }

    getPosition(event) {
        var elWidth = this.el.nativeElement.offsetWidth;
        var clicked = (event.offsetX);
        var pos = ((clicked / elWidth * 100) / 100) * this.duration;
        this.newCurrentTime.emit(pos);
    }
}
