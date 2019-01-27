<template>
  <Container :wide="true" id="artists">
     <template slot="header">
      <FavoritesTabs />
    </template>
    <div class="flex items-stretch flex-wrap justify-center">
      <div class="mt-2 my-6 mb-16 " style="width:155px">
        <router-link class="flex flex-col justify-center items-center p-4 text-center h-full text-grey-dark no-underline" :to="{path: '/random-show', 'query': {'from': 'artist'}}">
          <Zondicon icon="Shuffle" class="h-12 w-12 fill-current mb-4"/>
          Play a random show from your favorties
        </router-link>
      </div>
      <Artist v-for="artist of artistsList" :key="artist.identifier" :artist="artist"/>
    </div>
   </Container>
</template>

<script>
import datastore from '../services/datastore';
import Artist from '../components/Artist';
import Container from '../components/Container';
import FavoritesTabs from '../components/FavoritesTabs';
import helpers from '../services/helpers';

export default {
  name: 'FavoriteArtists',
  components: {
    Container,
    Artist,
    FavoritesTabs
  },
  data() {
    return {
      artistsList: []
    };
  },
  async mounted() {
    helpers.setTitle('Favorite Artists');
    this.artistsList = await datastore.getFavoriteArtists();
  }
};
</script>

