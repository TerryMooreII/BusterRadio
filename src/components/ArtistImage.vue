<template>
   <img :class="classes" v-bind:src="imageUrl" v-bind:alt="altTag" @click="$emit('click')">
</template>

<script>
export default {
  name: 'ArtistImage',
  props: {
    classes: String,
    artist: [Object, Function]
  },
  computed: {
    altTag() {
      if (this.artist) {
        return this.artist.identifier;
      }
      return 'artist';
    },
    imageUrl() {
      if (this.artist) {
        return `https://archive.org/services/img/${this.artist.identifier}`;
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
  img {
    height: 150px;
    width: 150px;
    background: white;
  }
</style>
