<template>
  <div class="show overflow-hidden mx-4 my-4">
    <img class="rounded-full border border-solid border-grey p-1" v-bind:src="imageUrl" @click="getYears(artist.identifier)">
    <div class="p-1">
      <div class="antialiased font-bold text-sm mb-1 text-center text-grey-darkest">{{artist.title}}</div>
    </div>
  </div>


  
</template>

<script>
export default {
  name: 'List',
  props: {
    artist: Object,
  },
  computed: {
    imageUrl() {
      return 'https://archive.org/services/img/' + this.artist.identifier;
    }
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
