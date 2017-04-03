import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class QueueManagerService {

    currentTrack$: BehaviorSubject<any> = new BehaviorSubject({});

    current: any = {};

    constructor() {
    }

    getCurrentTrack(){
        return this.currentTrack$.asObservable();
    }

    setTrack(track) {
        this.current.track = track;
        this.broadcast();
    }


    isPlaying(val) {
        this.current.isPlaying = val;
        this.broadcast();
    }

    broadcast() {
        this.currentTrack$.next(this.current);
    }

}
