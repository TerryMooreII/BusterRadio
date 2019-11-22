<template>
  <Container>
      <template slot="header">
        <ArtistHeader :artist="artist" />
      </template>
      <Loading v-if="!shows" />
      <div v-for="show of shows"
           :key="show.identifier"
           class="flex py-2 hover:bg-grey-lighter cursor-pointer items-center px-0 md:px-5"
           @click="getShow(show.identifier)">
        <div class="w-3/5 text-grey-darkest leading-normal text-sm">
          <span class="text-grey-darkest">{{show.date| removeTimezone | dateformat}}</span>
          <span class="text-white text-xs bg-blue-dark px-1 py-px rounded ml-3" v-if="show.soundboard">Soundboard</span>
          <br />
          <span class="text-grey-darker mr-2 text-lg">{{show.venue}}</span> <br />
          <span class="text-grey-darker text-sm">{{show.coverage}}</span>
        </div>
        <div class="w-2/5 text-right text-grey-dark text-sm">
          <Stars cssClass="h-4 w-4" :rank="show.avg_rating" />
        </div>
      </div>
  </Container>
</template>

<script>
import ArchiveApi from '../api/archive';
import ArtistHeader from '../components/ArtistHeader';
import Loading from '../components/Loading';
import Stars from '../components/Stars';
import Container from '../components/Container';
import helpers from '../services/helpers';

export default {
  name: 'shows',
  components: {
    ArtistHeader,
    Loading,
    Stars,
    Container
  },
  data() {
    return {
      shows: null,
      artist: {}
    };
  },
  methods: {
    getShow(identifier) {
      this.$router.push(`${this.$route.params.year}/${identifier}`);
    }
  },
  mounted() {
    ArchiveApi.getShows(this.$route.params.artistId, this.$route.params.year).then(data => this.shows = data);
    this.artist = this.$store.getters['artists/artistByIdentifier'](this.$route.params.artistId);
    helpers.setTitle(`${this.artist.title} in ${this.$route.params.year}`);
  }
};
</script>
