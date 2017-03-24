import {Component, OnInit} from "@angular/core";
import {PlaylistService} from "../services/playlist/playlist.service";
import {Track} from "../models/show";
import {CacheService} from "../services/cache/cache.service";

@Component({
  selector: 'br-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.less']
})
export class NowPlayingComponent implements OnInit {

    track: Track;

    constructor(private playlist: PlaylistService, private cache:CacheService) {
    }

    ngOnInit() {

        this.playlist.getPlayer().subscribe(data => {
            this.track = data.track;
        });

    }

    getArtistIdentifier(artist){
        return this.cache.getIdentifierByArtist(artist);
    }

    goToAlbum(track){
        if (!track){
            return;
        }

        var year = this.getYear(track.album);

        if (!year){
            return ['/artists', this.getArtistIdentifier(track.creator), 'years'];
        }

        return ['/artists', this.getArtistIdentifier(track.creator), 'years', year, 'shows', track.identifier];

    }

    private getYear(album){
        if (!album){
            return null;
        }
        return album.substr(0, 4);
    }

    bandImage(artist){
        if (!artist){
            return ''
        }
        var url = 'http://archive.org/services/img/' + this.cache.getIdentifierByArtist(artist);
        return url;

    }
}
