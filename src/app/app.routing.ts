import {ModuleWithProviders}  from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {JustAddedComponent} from "./just-added/just-added.component";
import {ArtistsComponent} from "./artists/artists.component";
import {ShowsComponent} from "./shows/shows.component";
import {YearsComponent} from "./years/years.component";
import {ShowComponent} from "./show/show.component";
import {PlaylistComponent} from "./playlist/playlist.component";

export const routes: Routes = [
    {path: '', component: JustAddedComponent},
    {path: 'artists', component: ArtistsComponent},
    {path: 'artists/', component: ArtistsComponent},
    {path: 'artists/:artist/years', component: YearsComponent},
    {path: 'artists/:artist/years/:year/shows', component: ShowsComponent},
    {path: 'artists/:artist/years/:year/shows/:show', component: ShowComponent},
    {path: 'playlist', component:PlaylistComponent}
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(routes);
