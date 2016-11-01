import {Track} from "./show";
export class PlaylistItem{

    isPlaying:boolean;
    hasBeenPlayed:boolean;
    track:Track;

    constructor(track?, play?){
        this.isPlaying = play || false;
        this.hasBeenPlayed = false;
        this.track = track;
    }
}
