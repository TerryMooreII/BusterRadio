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

    topDownloadedArtists(count?) {
        count = count || 50;
        let url = this.ARCHIVE_ORG_API_URL + 'advancedsearch.php?q=collection%3Detree&fl%5B%5D=avg_rating&fl%5B%5D=call_number&fl%5B%5D=coverage&fl%5B%5D=creator&fl%5B%5D=date&fl%5B%5D=description&fl%5B%5D=downloads&fl%5B%5D=format&fl%5B%5D=headerImage&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=month&fl%5B%5D=num_reviews&fl%5B%5D=publicdate&fl%5B%5D=related-external-id&fl%5B%5D=source&fl%5B%5D=subject&fl%5B%5D=title&fl%5B%5D=type&fl%5B%5D=year&sort%5B%5D=downloads+desc&sort%5B%5D=&sort%5B%5D=&rows=' + count + '&page=1&output=json&callback=JSONP_CALLBACK&save=yes';
        return this.jsonp.get(url).map((response: any) => {

            return response._body.response.docs
        });
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

    getNewestShows(count, orderby?) {
        orderby = orderby || 'publicdate';

        let url = this.ARCHIVE_ORG_API_URL + 'advancedsearch.php?q=collection%3Aetree&fl%5B%5D=avg_rating&fl%5B%5D=call_number&fl%5B%5D=collection&fl%5B%5D=contributor&fl%5B%5D=coverage&fl%5B%5D=creator&fl%5B%5D=date&fl%5B%5D=description&fl%5B%5D=downloads&fl%5B%5D=foldoutcount&fl%5B%5D=format&fl%5B%5D=headerImage&fl%5B%5D=identifier&fl%5B%5D=imagecount&fl%5B%5D=language&fl%5B%5D=licenseurl&fl%5B%5D=mediatype&fl%5B%5D=month&fl%5B%5D=num_reviews&fl%5B%5D=oai_updatedate&fl%5B%5D=publicdate&fl%5B%5D=publisher&fl%5B%5D=rights&fl%5B%5D=scanningcentre&fl%5B%5D=source&fl%5B%5D=subject&fl%5B%5D=title&fl%5B%5D=type&fl%5B%5D=volume&fl%5B%5D=week&fl%5B%5D=year&sort%5B%5D=' + orderby + '+desc&sort%5B%5D=&sort%5B%5D=&rows=' + count + '&page=1&output=json&callback=JSONP_CALLBACK&save=yes';

        return this.jsonp.get(url).map((response: any) =>
            response
        );
    };

}
