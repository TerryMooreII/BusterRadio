import Vue from 'vue';
import logdna from '@logdna/browser';
import moment from 'moment';
import Router from 'vue-router';
import datastore from './services/datastore';
import Home from './views/Home.vue';
import LoadingArtists from './views/LoadingArtists.vue';
import Artists from './views/Artists.vue';
import LatestShows from './views/LatestShows.vue';
import Years from './views/Years.vue';
import Shows from './views/Shows.vue';
import Show from './views/Show.vue';
import Queue from './views/Queue.vue';
import Search from './views/Search.vue';
import RandomShow from './views/RandomShow.vue';
import FavoriteArtists from './views/FavoriteArtists.vue';
import FavoriteShows from './views/FavoriteShows.vue';
import Favorite from './views/Favorite.vue';
import RecentlyPlayed from './views/RecentlyPlayed.vue';
import Live from './views/Live.vue';
import Signup from './views/Signup.vue';
import Radio from './views/Radio.vue';

Vue.use(Router);

const router = new Router({
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
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/loading',
          component: LoadingArtists,
          name: 'loading'
        },
        {
          path: '/newest',
          component: LatestShows,
          name: 'newest'
        },
        {
          path: '/artists',
          component: Artists,
          name: 'artists'
        },
        {
          path: '/live',
          component: Live,
          name: 'live'
        },
        {
          path: '/signup',
          component: Signup,
          name: 'signup'
        },
        {
          path: '/favorite',
          name: 'favorite',
          component: Favorite,
          children: [
            {
              path: '',
              component: FavoriteArtists,
              name: 'favoriteArtists',
              meta: {
                requiresAuth: true
              }
            },
            {
              path: 'artists',
              component: FavoriteArtists,
              name: 'favoriteArtists',
              meta: {
                requiresAuth: true
              }
            },
            {
              path: 'shows',
              component: FavoriteShows,
              name: 'favoriteShows',
              meta: {
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: '/recent',
          component: RecentlyPlayed,
          name: 'recent',
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/radio',
          component: Radio,
          name: 'radio'
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
          path: '/search/artists',
          component: Search,
          name: 'search-artists'
        },
        {
          path: '/search/locations',
          component: Search,
          name: 'search-locations'
        },
        {
          path: '/search/songs',
          component: Search,
          name: 'search-songs'
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
        },
        { path: '*', redirect: '/newest' }
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

router.beforeEach((to, from, next) => {
  logdna.log(`Route change ${to.fullPath}`);
  if (to.name !== 'loading' && (!localStorage.artists || !localStorage.artistFetch || moment().diff(parseInt(localStorage.artistFetch, 10), 'weeks') >= 1)) {
    next(`/loading?redirect=${to.path}`);
  }

  const currentUser = datastore.getCurrentUser();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (!currentUser && requiresAuth) {
    next('/');
  } else {
    next();
  }
});

export default router;
