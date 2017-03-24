import {Component, OnInit, OnChanges, SimpleChanges, Input} from '@angular/core';


@Component({
    selector: 'br-play-time',
    templateUrl: './play-time.component.html',
    styleUrls: ['./play-time.component.less']
})
export class PlayTimeComponent implements OnInit, OnChanges{
    @Input() currentTime:string;
    @Input() duration:string;

    current:string;
    total:string;

    constructor() {
        this.current = '0:00';
        this.total = '0:00';
    }

    ngOnChanges(changes:SimpleChanges){

        if (changes.currentTime){
            this.setCurrent(changes.currentTime.currentValue);
        }

        if (changes.duration){
            this.setTotal(changes.duration.currentValue);
        }

    }

    parseTime(time){
        var value = parseInt(time, 10);
        var lenMins = Math.floor(value/60);
        var lenSecs = value - lenMins * 60;


        if (isNaN(lenMins)) { lenMins = 0; }
        if (isNaN(lenSecs)) { lenSecs = 0; }

        return lenMins + ':' + (lenSecs > 9 ? lenSecs : '0' + lenSecs);
    }


    setCurrent(time){
        this.current = this.parseTime(time);
    }

    setTotal(time){
        this.total = this.parseTime(time);
    }


    ngOnInit() {

    }

}
