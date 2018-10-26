<template>
  <div class="flex-grow px-0 sm:px-24 sm:mt-0 mt-3 overflow-scroll">
    <NoResults width="361px">
      <Shuffle v-bind:cssClass="'h-24 w-24 fill-current block ml-2'" slot="icon"/>
        Grabbing a random show.
    </NoResults>
  </div>
</template>

<script>
import datastore from '../services/datastore';
import icons from '../icons';
import ArchiveApi from '../api/archive';
import NoResults from '../components/NoResults';

export default {
  name: 'years',
  components: {
    NoResults,
    Shuffle: icons.Shuffle
  },
  methods: {
    async getRandomShow(fromFav = this.$route.query.from) {
      let  artists;
      if (fromFav) {
        const firebaseArtists = await datastore.getFavoriteArtists();
        artists = Object.keys(firebaseArtists).map(k => firebaseArtists[k])
      } else {
        artists = this.$store.getters['artists/all'];
      }
      
      const artistId = artists[Math.floor(Math.random() * artists.length)].identifier;

      let year;

      try {
        const years = await ArchiveApi.getYears(artistId);
        if (years.length === 0) return await this.getRandomShow();

        year = years[Math.floor(Math.random() * years.length)].year;

        const shows = await ArchiveApi.getShows(artistId, year);
        if (!shows) return await this.getRandomShow();

        const keys = Object.keys(shows);
        const id = keys[Math.floor(Math.random() * keys.length)];
        const identifier = shows[id].identifier;
        this.$router.push(`${artistId}/${year}/${identifier}`);
      } catch (error) {
        console.log(error);
      }
    }
  },
  async mounted() {
    await this.getRandomShow();
  }
};
</script>
