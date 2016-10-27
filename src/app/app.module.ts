import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {appRouting} from "./app.routing";
import {JustAddedComponent} from './just-added/just-added.component';
import {MaterializeModule} from "angular2-materialize";
import {ArchiveService} from "./services/archive/archive.service";
import {ArtistsComponent} from './artists/artists.component';
import {ShowsComponent} from './shows/shows.component';
import {CacheService} from "./services/cache/cache.service";
import {YearsComponent} from './years/years.component';
import {ShowComponent} from './show/show.component';
import {StarsComponent} from './stars/stars.component';
import {PlaylistService} from "./services/playlist/playlist.service";
import {PlaylistComponent} from './playlist/playlist.component';
import {AudioControlsComponent} from './audio-controls/audio-controls.component';
import {NowPlayingComponent} from './now-playing/now-playing.component';
import {FooterComponent} from './footer/footer.component';

@NgModule({
    declarations: [
        AppComponent,
        JustAddedComponent,
        ArtistsComponent,
        ShowsComponent,
        YearsComponent,
        ShowComponent,
        StarsComponent,
        PlaylistComponent,
        AudioControlsComponent,
        NowPlayingComponent,
        FooterComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        MaterializeModule,
        appRouting
    ],
    providers: [
        ArchiveService,
        CacheService,
        PlaylistService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
