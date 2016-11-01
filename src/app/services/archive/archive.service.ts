import {Injectable} from '@angular/core';
import {Jsonp, RequestOptions} from "@angular/http";

@Injectable()
export class ArchiveService {


    private allArtists: Array<any>;
    private ARCHIVE_ORG_API_URL = 'http://www.archive.org/';


    constructor(private jsonp: Jsonp) {

    }

    loadArtists() {
        let url = this.ARCHIVE_ORG_API_URL + 'advancedsearch.php?q=mediatype%3Acollection+AND+collection%3Aetree&fl[]=identifier&fl[]=title&sort[]=titleSorter+asc&sort[]=&sort[]=&rows=10000&page=1&callback=JSONP_CALLBACK&save=yes&output=json';
        return this.jsonp.get(url).map((response: any) =>
            response
        );
    }

    getShows(artist) {
        let url = this.ARCHIVE_ORG_API_URL + 'advancedsearch.php?q=mediatype:(etree)+AND+collection:(' + artist + ')&fl[]=title&fl[]=avg_rating&fl[]=coverage&fl[]=date&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=year&sort[]=year+desc&desc[]=&sort[]=&rows=15000&page=1&callback=JSONP_CALLBACK&output=json';
        return this.jsonp.get(url).map((response: any) =>
            response
        );
    }

    getShow(identifier) {
        let url = this.ARCHIVE_ORG_API_URL + 'details/' + identifier + '?callback=JSONP_CALLBACK&output=json';
        return this.jsonp.get(url).map((response: any) =>
            response
        );
    }

}
