<template>
  <div class="flex-grow px-24 py-2 overflow-scroll width-full antialiased pt-10">
    <div class="flex flex-wrap flex-col  p-4">
      <div class="flex flex-col items-center width-full border-b border-solid border-grey mb-2">
         <ArtistImage classes="rounded-full border border-solid border-grey p-2 artist-image" :artist="artist" />
        <h1 class="py-4 ">{{artist.title}}</h1>
      </div>
      <Loading v-if="!years.length" />
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
  </div>
</template>

<script>
import icons from '../icons';
import ArchiveApi from '../api/archive';
import ArtistImage from '../components/ArtistImage';
import Loading from '../components/Loading';

export default {
  name: 'years',
  components: {
    Calendar: icons.Calendar,
    ArtistImage,
    Loading
  },
  data() {
    return {
      years: [],
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

<style >
  .artist-image {
    height: 200px;
    width: 200px;
    background: white;
  }
</style>
