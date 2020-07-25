<template>
  <div class="flex-grow mt-24 w-2/3 ">
    <div class="flex text-grey-darker leading-normal justify-around ">
      <div class="flex flex-col rounded w-2/5 p-6 pb-24">
      <NoResults width="361px">
        <Zondicon icon="Shuffle" class="h-24 w-24 fill-current block ml-2" slot="icon"/>
          Grabbing a random show.
      </NoResults>
    </div>
    </div>
  </div>
</template>

<script>
import datastore from '../services/datastore';
import ArchiveApi from '../api/archive';
import NoResults from '../components/NoResults';
import helpers from '../services/helpers';

export default {
  name: 'years',
  components: {
    NoResults
  },
  methods: {
    async getRandomShow(fromFav = this.$route.query.from) {
      let artists;
      if (fromFav) {
        const firebaseArtists = await datastore.getFavoriteArtists();
        artists = Object.keys(firebaseArtists).map((k) => firebaseArtists[k]);
      } else {
        artists = this.$store.getters['artists/all'];
      }

      const artistId = artists[Math.floor(Math.random() * artists.length)].identifier;

      let year;

      try {
        const years = await ArchiveApi.getYears(artistId);
        if (years.length === 0) return await this.getRandomShow();

        year = years[Math.floor(Math.random() * years.length)].year; // eslint-disable-line

        const shows = await ArchiveApi.getShows(artistId, year);
        if (!shows) return await this.getRandomShow();

        const keys = Object.keys(shows);
        const id = keys[Math.floor(Math.random() * keys.length)];
        const { identifier } = shows[id];
        this.$router.push(`${artistId}/${year}/${identifier}`);
      } catch (error) {
        console.log(error);
      }
      return true;
    }
  },
  async mounted() {
    helpers.setTitle('Random Show');
    await this.getRandomShow();
  }
};
</script>
