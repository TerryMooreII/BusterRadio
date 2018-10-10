<template>
  <div class="flex-grow px-0 sm:px-24 py-2 sm:mt-0 mt-3 overflow-scroll">
    <NoResults width="361px">
      <Shuffle v-bind:cssClass="'h-24 w-24 fill-current block ml-2'" slot="icon"/>
        Grabbing a random show.
    </NoResults>
  </div>
</template>

<script>
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
    getRandomShow() {
      const artists = this.$store.getters['artists/all'];
      const artistId = artists[Math.floor(Math.random() * artists.length)].identifier;
      let year;

      ArchiveApi.getYears(artistId)
        .then(years => {
          if (years.length === 0) {
            this.getRandomShow();
            return Promise.resolve(null);
          }
          year = years[Math.floor(Math.random() * years.length)].year;
          return ArchiveApi.getShows(artistId, year)  
        })
        .then(shows => {
          if (!shows){
            return;
          }
          const keys = Object.keys(shows);
          const id = keys[Math.floor(Math.random() * keys.length)];
          const identifier = shows[id].identifier;
          this.$router.push(`${artistId}/${year}/${identifier}`);
        });
    }
  },
  mounted() {
    this.getRandomShow();
  }
};
</script>
