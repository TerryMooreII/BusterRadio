<template>
  <Container :wide="true" id="artists">
     <template slot="header">
      <div class="w-full sm:w-1/3">
        <h2>Favorite Artists</h2>
      </div>
      <div class="w-full sm:w-2/3 text-right">
        <router-link class="text-grey-dark no-underline hover:underline" :to="{path: '/random-show', 'query': {'from': 'artist'}}">
          Play Random Show From Favs
        </router-link>
      </div>
    </template>
    <div class="flex items-stretch flex-wrap justify-center">
      <Artist v-for="artist of artistsList" :key="artist.identifier" :artist="artist"/>
    </div>
   </Container>
</template>

<script>
import datastore from '../services/datastore';
import Artist from '../components/Artist';
import Container from '../components/Container';

export default {
  name: 'FavoriteArtists',
  components: {
    Container,
    Artist
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

