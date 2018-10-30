<template>
  <Container>
      <template slot="header">
        <ArtistHeader :artist="artist" />
      </template>
      <Loading v-if="!shows" />
      <RecordingsModal :recordings="recordings" :artist="artist" @dismiss="() => recordings = null" v-if="recordings" />
      <div v-for="show of shows"
           :key="show.identifier"
           class="flex py-2 hover:bg-grey-lighter cursor-pointer items-center px-0 sm:px-5"
           @click="getShow(show.identifier)">
        <div class="w-3/4 text-grey-darkest leading-normal text-sm">
          <span class="text-grey-darkest italic">{{show.date| removeTimezone | dateformat}}</span>
          <span class="text-white text-xs bg-blue-dark px-1 py-px rounded ml-3" v-if="show.soundboard">Soundboard</span>
          <br />
          <span class="text-grey-darker mr-2 text-lg">{{show.venue}}</span> <br />
          <span class="text-grey-darker text-sm">{{show.coverage}}</span>
        </div>
        <div class="w-1/4 text-right text-grey-dark italictext-sm">
          <Stars cssClass="h-4 w-4" :rank="show.avg_rating" />
          <div @click.stop="recordings = show" class="hover:underline">{{show.count}} recordings</div>
        </div>
      </div>
  </Container>
</template>

<script>
import icons from '../icons';
import ArchiveApi from '../api/archive';
import ArtistHeader from '../components/ArtistHeader';
import Loading from '../components/Loading';
import Stars from '../components/Stars';
import RecordingsModal from '../components/RecordingsModal';
import Container from '../components/Container';

export default {
  name: 'shows',
  components: {
    Calendar: icons.Calendar,
    ArtistHeader,
    Loading,
    Stars,
    RecordingsModal,
    Container
  },
  data() {
    return {
      shows: null,
      artist: {},
      recordings: null
    };
  },
  methods: {
    getShow(identifier) {
      this.$router.push(`${this.$route.params.year}/${identifier}`);
    }
  },
  mounted() {
    ArchiveApi.getShows(this.$route.params.artistId, this.$route.params.year).then(data => this.shows = data);
    this.artist = this.$store.getters['artists/artist'](this.$route.params.artistId);
  }
};
</script>
