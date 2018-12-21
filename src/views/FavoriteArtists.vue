<template>
  <Container :wide="true" id="artists">
     <template slot="header">
      <FavoritesTabs />
    </template>
    <!-- <router-link class="text-grey-dark no-underline hover:underline" :to="{path: '/random-show', 'query': {'from': 'artist'}}">
          Play Random Show From Favs
        </router-link> -->
    <div class="flex items-stretch flex-wrap justify-center">
      <Artist v-for="artist of artistsList" :key="artist.identifier" :artist="artist"/>
    </div>
   </Container>
</template>

<script>
import datastore from '../services/datastore';
import Artist from '../components/Artist';
import Container from '../components/Container';
import FavoritesTabs from '../components/FavoritesTabs';

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
    this.artistsList = await datastore.getFavoriteArtists();
  }
};
</script>

