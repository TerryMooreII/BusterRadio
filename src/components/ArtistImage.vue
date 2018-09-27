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
    }
  }
};
</script>
