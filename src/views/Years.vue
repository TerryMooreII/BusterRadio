<template>
  <Container>
     <template slot="header">
        <ArtistHeader :artist="artist" />
      </template>
    <Loading v-if="!years" />
    <div v-for="year of years"
          :key="year.year"
          class="flex py-4 hover:bg-grey-lighter cursor-pointer items-center"
          @click="getShows(year.year)">
      <div class="w-1/2 text-grey-darkest px-5">
        <Zondicons icon="Calendar" class="h-4 w-4 fill-current text-grey-dark inline-block self-center mr-6 mt-px"/> {{year.year}}
      </div>
      <div class="w-1/2 text-right text-grey-dark italic px-5">
        {{year.total}} shows
      </div>
    </div>
  </Container>
</template>

<script>
import Zondicons from '../icons/Zondicons';
import ArchiveApi from '../api/archive';
import Loading from '../components/Loading';
import Container from '../components/Container';
import ArtistHeader from '../components/ArtistHeader';

export default {
  name: 'years',
  components: {
    ArtistHeader,
    Zondicons,
    Loading,
    Container
  },
  data() {
    return {
      years: null,
      artist: {}
    };
  },
  methods: {
    getShows(year) {
      this.$router.push(`${this.$route.params.artistId}/${year}`);
    }
  },
  mounted() {
    ArchiveApi.getYears(this.$route.params.artistId).then(data => this.years = data);
    this.artist = this.$store.getters['artists/artist'](this.$route.params.artistId);
  }
};
</script>
