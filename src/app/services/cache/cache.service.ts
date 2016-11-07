import {Injectable} from '@angular/core';

@Injectable()
export class CacheService {

    private artistsCache: any = null;
    private showsCache: any = {};

    constructor() {
    }

    getArtistByIdentifier(identifier) {
        if (!this.artistsCache){
            return;
        }

        var artist = this.artistsCache.filter(item => {
            return item.identifier === identifier;
        });

        if (artist.length > 0) {
            return artist[0].title;
        }
    }

    getIdentifierByArtist(artist) {
        if (!this.artistsCache){
            return;
        }

        var artist = this.artistsCache.filter(item => {
            return item.title === artist;
        });

        if (artist.length > 0) {
            return artist[0].identifier;
        }
    }

    setArtistsCache(list) {
        this.artistsCache = list;
    }

    getArtists(query?: String) {
        if (!query) {
            return this.artistsCache;
        }

        if (!this.artistsCache){
            return this.artistsCache;
        }

        return this.artistsCache.filter(data => {
            return data.title.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
    }


    setShows(identifer, shows) {
        if (!this.showsCache[identifer]) {
            this.showsCache[identifer] = {};
        }

        this.showsCache[identifer].shows = shows;
    }

    setYears(identifer, years) {
        if (!this.showsCache[identifer]) {
            this.showsCache[identifer] = {};
        }

        this.showsCache[identifer].years = years;
    }

    getYears(identifier) {
        return this.showsCache[identifier] && this.showsCache[identifier].years ? this.showsCache[identifier].years : null;
    }

    getShows(identifier, year?) {
        if (!year) {
            return this.showsCache[identifier] && this.showsCache[identifier].show ? this.showsCache[identifier].showsCache : null;
        }

        if (this.showsCache[identifier] && this.showsCache[identifier].shows) {
            return this.showsCache[identifier].shows.filter(show => {
                return show.year === year;
            }).sort((a, b) => {
                a = new Date(a.date);
                b = new Date(b.date);
                return b > a ? -1 : b < a ? 1 : 0;
            });
        }

    }

}