<template>
  <Container>     
    <div class="flex antialiased text-grey-darkest px-2 sm:px-0 py-6 sticky pin-t w-full bg-white">
      <div class="w-full">
        <h2>Playing from around the world </h2>
      </div>
    </div>

    <div v-if="liveList">
      <RecentTracks :tracks="liveList" />
    </div>
  </Container>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import datastore from '../services/datastore';
import icons from '../icons';
import RecentTracks from '../components/RecentTracks';
import NoResults from '../components/NoResults';
import Container from '../components/Container';

export default {
  name: 'RecentlyPlayed',
  components: {
    Container,
    NoResults,
    RecentTracks,
    MusicPlaylist: icons.MusicPlaylist
  },
  data() {
    return {
      liveList: null
    };
  },
  async mounted() {
    const recent = await datastore.getLive();
    this.liveList = Object.values(recent).map(val => val).reverse();
  }
};
</script>
