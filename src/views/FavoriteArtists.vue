<template>
  <div id="artists" class="flex-grow px-0 sm:px-24 sm:mt-0 mt-3 overflow-scroll">
     <div class="flex antialiased text-grey-darkest px-2 sm:px-16 py-6 sticky pin-t w-full bg-white z-10">
      <div class="w-1/3">
        <h2>Your Favorite Artists</h2>
      </div>
      <div class="w-2/3 text-right">
        <router-link class="text-grey-dark no-underline hover:underline" :to="{path: '/random-show', 'query': {'from': 'artist'}}">Play Random From Favorites</router-link>
      </div>
    </div>
    <div class="flex items-stretch flex-wrap justify-center">
      <Artist v-for="artist of artistsList" :key="artist.identifier" :artist="artist"/>
    </div>
   </div>
</template>

<script>
import datastore from '../services/datastore';
import Artist from '../components/Artist';

export default {
  name: 'FavoriteArtists',
  components: {
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

