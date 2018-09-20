<template>
  <div class="show overflow-hidden mx-4 my-4">
    <img class="" v-bind:src="imageUrl" @click="getShow(show)">
    <div class="p-1">
      <div class="antialiased font-bold text-sm mb-1">{{show.creator}}</div>
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
export default {
  name: 'ShowCard',
  props: {
    show: Object,
  },
  computed: {
    date() {
      if (!this.show.date){
        return '';
      }
      return this.show.date.split('T')[0];
    },
    imageUrl() {
      const artist = this.$store.getters['artists/artist'](this.show.creator);
      if (artist){
        return 'https://archive.org/services/img/' + artist.identifier;
      }
      // undefined will just return a default image
      return 'https://archive.org/services/img/undefined';
    }
  },
  methods: {
    getShow(show) {
      ArchiveApi.getShow(show.identifier)
        .then(show => console.log(show));
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
