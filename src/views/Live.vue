<template>
  <Container>
    <div class="flex text-grey-darkest px-2 md:px-0 py-6 md:sticky pin-t w-full bg-white">
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
import datastore from '../services/datastore';
import RecentTracks from '../components/RecentTracks';
import Container from '../components/Container';
import helpers from '../services/helpers';

export default {
  name: 'RecentlyPlayed',
  components: {
    Container,
    RecentTracks
  },
  data() {
    return {
      liveList: null
    };
  },
  async mounted() {
    helpers.setTitle('Live');
    const recent = await datastore.getLive();
    this.liveList = Object.values(recent).map((val) => val).reverse();
  }
};
</script>
