<template>
  <div class="flex w-full">
    <router-link :to="{name: 'favoriteArtists'}" class="tab-item">Artists</router-link>
    <router-link :to="{name: 'favoriteShows'}" class="tab-item">Shows</router-link>
  </div>
</template>

<script>
import datastore from '../services/datastore';
import Artist from '../components/Artist';
import Container from '../components/Container';

export default {
  name: 'Favorites',
  components: {
    Container
  },
  data() {
    return {
    };
  }
};
</script>

<style lang="postcss" scoped>
  .tab-item {
    @apply .flex .w-1/2 .justify-center .items-center .pt-6 .pb-2 .border-b .border-grey .text-center .text-grey-darkest .no-underline
  }
  .tab-item.router-link-exact-active {
    @apply .border-b-2 .border-blue-dark
  }
</style>


