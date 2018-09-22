<template>
  <div class="show overflow-hidden mx-4 my-4">
    <ArtistImage classes="rounded-full border border-solid border-grey p-1 cursor-pointer" :artist="artist" @click="getYears(artist.identifier)"/>
    <div class="p-1">
      <div class="antialiased font-bold text-sm mb-1 text-center text-grey-darkest">{{artist.title}}</div>
    </div>
  </div>
</template>

<script>
import ArtistImage from './ArtistImage'
export default {
  name: 'List',
  components: {
    ArtistImage
  },
  props: {
    artist: Object,
  },
  methods: {
    getYears(identifier) {
      this.$router.push(`/${identifier}`);
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
