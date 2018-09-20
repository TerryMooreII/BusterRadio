import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Artists from './views/Artists.vue';
import LatestShows from './views/LatestShows.vue';
import Years from './views/Years.vue';
import Shows from './views/Shows.vue';
import Show from './views/Show.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '',
          component: Artists,
          name: 'artists'
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
        {
          path: 'newest',
          component: LatestShows,
          name: 'newest'
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    }
  ]
});
