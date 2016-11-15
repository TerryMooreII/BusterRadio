import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {appRouting} from "./app.routing";
import {JustAddedComponent} from "./just-added/just-added.component";
import {MaterializeModule} from "angular2-materialize";
import {ArchiveService} from "./services/archive/archive.service";
import {ArtistsComponent} from "./artists/artists.component";
import {ShowsComponent} from "./shows/shows.component";
import {CacheService} from "./services/cache/cache.service";
import {YearsComponent} from "./years/years.component";
import {ShowComponent} from "./show/show.component";
import {StarsComponent} from "./stars/stars.component";
import {PlaylistService} from "./services/playlist/playlist.service";
import {PlaylistComponent} from "./playlist/playlist.component";
import {AudioControlsComponent} from "./audio-controls/audio-controls.component";
import {NowPlayingComponent} from "./now-playing/now-playing.component";
import {FooterComponent} from "./footer/footer.component";
import {SpinnerComponent} from "./spinner/spinner.component";
import {TrackScrollDirective} from "./track-scroll/track-scroll.directive";
import {NotificationDirective} from "./notification/notification.directive";
import {SideNavMenuComponent} from "./side-nav-menu/side-nav-menu.component";
import {SearchComponent} from "./search/search.component";
import {SearchResultsComponent} from "./search-results/search-results.component";
import {ShowCardComponent} from "./show-card/show-card.component";
import {ArtistCardComponent} from "./artist-card/artist-card.component";
import {IsLoadedGuardService} from "./services/guards/is-loaded-guard.service";
import {MainComponent} from "./main/main.component";
import { GenresComponent } from './genres/genres.component';

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
        FooterComponent,
        SpinnerComponent,
        TrackScrollDirective,
        TrackScrollDirective,
        NotificationDirective,
        SideNavMenuComponent,
        SearchComponent,
        SearchResultsComponent,
        ShowCardComponent,
        ArtistCardComponent,
        MainComponent,
        GenresComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        ReactiveFormsModule,
        MaterializeModule,
        appRouting
    ],
    providers: [
        ArchiveService,
        CacheService,
        PlaylistService,
        IsLoadedGuardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
