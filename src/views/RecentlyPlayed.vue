<template>
  <Container>
    <div class="flex text-grey-darkest px-2 sm:px-0 py-6 sticky pin-t w-full bg-white">
      <div class="w-full">
        <h2>Last 100 Tracks Played</h2>
      </div>
    </div>

    <NoResults v-if="!recentList" width="361px">
        <Zondicon icon="MusicPlaylist" class="h-24 w-24 fill-current block ml-2" slot="icon"/>
        Go play some music!!!
    </NoResults>

    <div v-if="recentList">
      <RecentTracks :tracks="recentList" />
    </div>
  </Container>
</template>

<script>
import datastore from '../services/datastore';
import RecentTracks from '../components/RecentTracks';
import NoResults from '../components/NoResults';
import Container from '../components/Container';
import helpers from '../services/helpers';

export default {
  name: 'RecentlyPlayed',
  components: {
    Container,
    NoResults,
    RecentTracks
  },
  data() {
    return {
      recentList: null
    };
  },
  async mounted() {
    helpers.setTitle('History');
    const recent = await datastore.getRecents();
    this.recentList = Object.values(recent).map(val => val).reverse();
  }
};
</script>
