import {Injectable} from '@angular/core';
import {CanActivateChild, CanActivate} from "@angular/router";
import {ArchiveService} from "../archive/archive.service";
import {CacheService} from "../cache/cache.service";
import {Observable} from "rxjs";

@Injectable()
export class IsLoadedGuardService implements CanActivate, CanActivateChild {

    constructor(private archiveService: ArchiveService, private cache: CacheService) {
    }

    canActivateChild() {
        return false;
    }

    canActivate() {
        return this.archiveService.loadArtists().map((data) => {
            this.cache.setArtistsCache(data._body.response.docs);
            return true;
        }).first();

    }
}
