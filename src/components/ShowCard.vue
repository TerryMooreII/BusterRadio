<template>
  <div class="show overflow-hidden mx-4 my-4 relative shadow flex flex-col justify-between p-3 pb-px bg-white rounded" v-if="artist">
    <div class="flex justify-center">
      <ArtistImage :artist="artist" @click="getShow(show)" classes="cursor-pointer"/>
    </div>
    
    <div class="py-2 items-stretch text-center lg:text-left w-full">
      <router-link :to="{name: 'years', params: {artistId: artist.identifier}}" v-if="artist.identifier"
                  class="antialiased font-bold text-sm mb-1 text-black no-underline hover:underline"
                  >{{artist.title}}</router-link>
      <p class="text-sm leading-tight truncate items-stretch">
      <span class="subpixel-antialiased date text-grey-darkest text-xs italic ">{{date}}</span> <br />
        <span class="antialiased text-grey-darker">{{show.venue}}</span> <br />
        <span class="antialiased text-grey-dark italic ">{{show.coverage || show.location}}</span> &nbsp;
      </p>
    </div>
    <div class="w-100 h-8 border-t border-solid border-grey-light py-1 text-right flex flex-row items-center justify-between">
      <div class="text-grey-dark flex items-center">
        <span class="bg-white border border-blue-dark text-xs text-blue-dark px-1 py-px rounded" v-if="show.soundboard">Soundboard</span>
      </div>
      <div>
        <FavoriteShow :show="show"/>
      </div>
    </div>
  </div>
</template>

<script>

import ArchiveApi from '../api/archive';
import ArtistImage from './ArtistImage';
import FavoriteShow from './FavoriteShow';

export default {
  name: 'ShowCard',
  components: {
    ArtistImage,
    FavoriteShow
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
      return this.$store.getters['artists/artist'](this.show.creator || this.show.artist);
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
  @media (max-width: 992px) {
    .img {
      width: 100%;
    }
    .show {
      width: 100%
    }
  }
</style>
