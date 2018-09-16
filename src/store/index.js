import Vue from 'vue';
import Vuex from 'vuex';
import playlist from './modules/playlist';
import artists from './modules/artists';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    playlist,
    artists
  },
  strict: debug
});
