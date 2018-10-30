<template>
  <Container>
    <div class="flex flex-wrap flex-col px-2 sm:px-0 p-4">
      <div class="flex flex-col items-center width-full mb-2 bg-white">
         <ArtistImage classes="rounded-full border border-solid border-grey p-2 artist-image" :artist="artist" />
      </div>
      <div class="flex flex-col items-center width-full border-b border-solid border-grey mb-2 sticky pin-t bg-white">
         <h1 class="py-4 ">{{artist.title}}</h1>
      </div>
      <Loading v-if="!years" />
      <div v-for="year of years"
           :key="year.year"
           class="flex py-2 hover:bg-grey-lighter cursor-pointer items-center"
           @click="getShows(year.year)">
        <div class="w-1/2 text-grey-darkest px-5">
          <Calendar v-bind:cssClass="'h-4 w-4 fill-current text-grey-dark inline-block self-center mr-6 mt-px'"/> {{year.year}}
        </div>
        <div class="w-1/2 text-right text-grey-dark italic px-5">
          {{year.total}} shows
        </div>
      </div>
   </div>
  </Container>
</template>

<script>
import icons from '../icons';
import ArchiveApi from '../api/archive';
import ArtistImage from '../components/ArtistImage';
import Loading from '../components/Loading';
import Container from '../components/Container';

export default {
  name: 'years',
  components: {
    Calendar: icons.Calendar,
    ArtistImage,
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
