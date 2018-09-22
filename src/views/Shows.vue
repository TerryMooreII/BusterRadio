<template>
  <div class="flex-grow px-24 py-2 overflow-scroll width-full antialiased pt-10 ">
    <div class="flex flex-wrap flex-col  p-4">
      <div class="flex flex-col items-center width-full border-b border-solid border-grey mb-2">
        <ArtistImage classes="rounded-full border border-solid border-grey p-2" :artist="artist" />
        <h1 class="py-4 ">{{artist.title}}</h1>
      </div>
      
      <div v-for="show of shows" 
           :key="show.identifier" 
           class="flex py-2 hover:bg-grey-lighter cursor-pointer items-center"
           @click="getShow(show.identifier)"> 
        <div class="w-3/4 text-grey-darkest px-5 leading-normal text-sm">
          <!-- <Calendar v-bind:cssClass="'h-4 w-4 fill-current text-grey-dark inline-block self-center mr-6 mt-px'"/> -->
          <span class="text-grey-darkest italic">{{date(show.date)}} </span><br />
          <span class="text-grey-darker mr-2 text-lg">{{show.venue}}</span> <br>
          <span class="text-grey-darker text-sm">{{show.coverage}}</span>
        </div>
        <div class="w-1/4 text-right text-grey-dark italic px-5 text-sm">
          {{show.avg_rating || 0}} stars <br />
          {{show.count}} recordings
        </div>
      </div>
   </div>
  </div>
</template>

<script>
import moment from 'moment';
import icons from '../icons';
import ArchiveApi from '../api/archive';
import ArtistImage from '../components/ArtistImage';

export default {
  name: 'shows',
  components: {
    Calendar: icons.Calendar,
    ArtistImage
  },
  data() {
    return {
      shows: [],
      artist: {}
    }
  },
  methods: {
    getShow(identifier){
       this.$router.push(`${this.$route.params.year}/${identifier}`)
    },
    date(date) {
      return moment(date).format('LL');
    }
  },
  mounted() {
    ArchiveApi.getShows(this.$route.params.artistId, this.$route.params.year).then(data => this.shows = data);
    this.artist = this.$store.getters['artists/artist'](this.$route.params.artistId);
  }
};
</script>

<style>
  img { 
    height: 200px;
    width: 200px;
    background: white;
  }
</style>
