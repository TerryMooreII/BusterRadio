<template>
  <div class="show overflow-hidden mx-4 my-4 relative shadow flex flex-col justify-between p-3 pb-px bg-white rounded" v-if="artist">
    <div class="flex justify-center">
      <ArtistImage :artist="artist" @click="getShow(show)" classes="cursor-pointer"/>
    </div>

    <div class="py-2 items-stretch text-center lg:text-left w-full">
      <router-link :to="{name: 'years', params: {artistId: artist.identifier}}" v-if="artist.identifier"
                  class="font-bold text-sm mb-1 text-black no-underline hover:underline"
                  >{{artist.title}}</router-link>
      <p class="text-sm leading-tight truncate items-stretch">
      <span class="subpixel-date text-grey-darkest text-xs ">{{date}}</span> <br />
        <span class="text-grey-darker">{{show.venue}}</span> <br />
        <span class="text-grey-dark ">{{show.coverage || show.location}}</span> &nbsp;
      </p>
    </div>
    <div class="w-100 h-8 border-t border-grey-light py-1 text-right flex flex-row items-center justify-between">
      <div class="text-grey-dark flex items-center">
        <span class="bg-white border border-blue-dark text-xs text-blue-dark px-1 py-px rounded" v-if="show.soundboard">Soundboard</span>
      </div>

      <div>
         <JambaseLookup :artist="artist" class="mr-3"/>
        <FavoriteShow :show="show"/>
      </div>
    </div>
  </div>
</template>

<script>
import ArtistImage from './ArtistImage';
import FavoriteShow from './FavoriteShow';
import JambaseLookup from './JambaseLookup';

export default {
  name: 'ShowCard',
  components: {
    ArtistImage,
    FavoriteShow,
    JambaseLookup
  },
  props: {
    show: Object
  },
  computed: {
    date() {
      if (!this.show.date) {
        return '';
      }
      return this.show.date.split('T')[0];
    },
    artist() {
      return this.$store.getters['artists/artistByTitle'](this.show.creator || this.show.artist);
    }
  },
  methods: {
    getShow(show) {
      this.$router.push(`/${this.artist.identifier}/${show.year}/${show.identifier}`);
    }
  }
};
</script>

<style scoped lang="less">
  .favorite {
    position: absolute;
  }
  img {
    height: 200px;
    width: 200px;
  }
  .show {
    width: 220px
  }
  @media (max-width: 576px) {
    .show {
      width: 100% !important;
    }
  }
  @media (max-width: 992px) {
    .show {
      width: 45%
    }
  }
</style>
