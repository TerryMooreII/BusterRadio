<template>
  <div id="artists" class="flex-grow px-0 sm:px-24 py-2 sm:mt-0 mt-3 overflow-scroll">
     <div class="flex antialiased text-grey-darkest px-2 sm:px-0 py-6 sticky pin-t w-full bg-white z-10">
      <div class="w-2/3">
        <h2>Your Favorite Artists</h2>
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

