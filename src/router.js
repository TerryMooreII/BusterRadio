import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Artists from './views/Artists.vue';
import LatestShows from './views/LatestShows.vue';
import Years from './views/Years.vue';
import Shows from './views/Shows.vue';
import Show from './views/Show.vue';
import Queue from './views/Queue.vue';
import Search from './views/Search.vue';
import RandomShow from './views/RandomShow.vue';
import FavoriteArtists from './views/FavoriteArtists.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          component: Artists,
          name: 'artists'
        },
        {
          path: '/favorite-artist',
          component: FavoriteArtists,
          name: 'favoriteArtists'
        },
        {
          path: '/random-show',
          component: RandomShow,
          name: 'random'
        },
        {
          path: '/search',
          component: Search,
          name: 'search'
        },
        {
          path: '/newest',
          component: LatestShows,
          name: 'newest'
        },

        {
          path: '/queue',
          component: Queue,
          name: 'queue'
        },
        {
          path: '/:artistId',
          component: Years,
          name: 'years'
        },
        {
          path: '/:artistId/:year',
          component: Shows,
          name: 'shows'
        },
        {
          path: '/:artistId/:year/:showId',
          component: Show,
          name: 'show'
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
});
