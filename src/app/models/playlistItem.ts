import {Track} from './show';
export class PlaylistItem {

    isPlaying: boolean;
    hasBeenPlayed: boolean;
    track: Track;
    isCurrent: boolean;

    constructor(track?, play?) {
        this.isPlaying = play || false;
        this.isCurrent = false;
        this.hasBeenPlayed = false;
        this.track = track;
    }
}
