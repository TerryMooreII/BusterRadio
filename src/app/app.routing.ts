import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {JustAddedComponent} from "./just-added/just-added.component";
import {ArtistsComponent} from "./artists/artists.component";
import {ShowsComponent} from "./shows/shows.component";
import {YearsComponent} from "./years/years.component";
import {ShowComponent} from "./show/show.component";
import {PlaylistComponent} from "./playlist/playlist.component";
import {SearchResultsComponent} from "./search-results/search-results.component";
import {IsLoadedGuardService} from "./services/guards/is-loaded-guard.service";
import {MainComponent} from "./main/main.component";

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [IsLoadedGuardService],
        children: [
            {path: '', component: JustAddedComponent},
            {path: 'new', component: JustAddedComponent},
            {path: 'search', component: SearchResultsComponent},
            {path: 'artists', component: ArtistsComponent},
            {path: 'artists/top/:count', component: ArtistsComponent},
            {path: 'artists/:artist/years', component: YearsComponent},
            {path: 'artists/:artist/years/:year/shows', component: ShowsComponent},
            {path: 'artists/:artist/years/:year/shows/:show', component: ShowComponent},
            {path: 'playlist', component: PlaylistComponent}
        ]
    }
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
