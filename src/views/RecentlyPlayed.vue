<template>
  <div class="flex-grow px-0 sm:px-10 lg:px-32 sxl:px-64 py-2 overflow-scroll width-full antialiased pt-10">     <div class="flex antialiased text-grey-darkest px-2 sm:px-0 py-6 sticky pin-t w-full bg-white">
      <div class="w-full">
        <h2>Last 100 Tracks Played</h2>
      </div>
    </div>

    <NoResults v-if="!recentList" width="361px">
        <MusicPlaylist v-bind:cssClass="'h-24 w-24 fill-current block ml-2'" slot="icon"/>
        Go play some music!!!
    </NoResults>

    <div v-if="recentList">
      <RecentTracks :tracks="recentList" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import datastore from '../services/datastore';
import icons from '../icons';
import RecentTracks from '../components/RecentTracks';
import NoResults from '../components/NoResults';

export default {
  name: 'RecentlyPlayed',
  components: {
    NoResults,
    RecentTracks,
    MusicPlaylist: icons.MusicPlaylist
  },
  data() {
    return {
      recentList: null
    };
  },
  async mounted() {
    const recent = await datastore.getRecents();
    this.recentList = Object.values(recent).map(val => val).reverse();
  }
};
</script>
