<template>
  <div class="show overflow-hidden mx-4 my-4" v-if="artist">
    <ArtistImage :artist="artist" @click="getShow(show)" classes="cursor-pointer"/>
    <div class="p-1">

      <router-link :to="{name: 'years', params: {artistId: artist.identifier}}" v-if="artist.identifier"
                  class="antialiased font-bold text-sm mb-1 text-black no-underline hover:underline"
                  >{{show.creator}}</router-link>
      <p class="text-sm leading-tight">
      <span class="subpixel-antialiased date text-grey-darkest text-xs italic">{{date}}</span> <br />
        <span class="antialiased text-grey-darker">{{show.venue}}</span> <br />
        <span class="antialiased text-grey-dark italic">{{show.coverage}}</span> &nbsp;
      </p>
    </div>
  </div>
</template>

<script>

import ArchiveApi from '../api/archive';
import ArtistImage from './ArtistImage';

export default {
  name: 'ShowCard',
  components: {
    ArtistImage
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
      return this.$store.getters['artists/artist'](this.show.creator);
    }
  },
  methods: {
    getShow(show) {
      this.$router.push(`${this.artist.identifier}/${show.year}/${show.identifier}`);
    }
  }
};
</script>

<style scoped lang="less">
  img {
    height: 155px;
    width: 155px;
  }
  .show {
    width:155px
  }
</style>
