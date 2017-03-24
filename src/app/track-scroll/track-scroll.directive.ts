
import {OnDestroy, EventEmitter, Directive, Output, HostListener} from "@angular/core";
@Directive({
    selector: '[track-scroll]'
})
export class TrackScrollDirective implements OnDestroy{
    @Output() pageYPositionChange:EventEmitter<any> = new EventEmitter();

    private el;

    constructor() {
        this.el = document.querySelectorAll('.content')[0];
        this.el.addEventListener('scroll', () =>{
            if (this.el.scrollTop % this.el.clientHeight <  50){
                this.pageYPositionChange.emit(true)
            }
        });
    }

    ngOnDestroy(){
        this.el.removeEventListener('scroll', () => {});
    }

    @HostListener('scroll', ['$event'])
    track(event:any) {
        console.log('fired');
        this.pageYPositionChange.emit(document.querySelectorAll('.content')[0].scrollTop);
    }
}
