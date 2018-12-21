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
  .tabs {}
  .tab-item {
    @apply .w-1/2 .text-center .border-b .border-grey .p-6 .text-lg .no-underline .text-blue-dark border-b-2 .bg-grey-lightest
  }
  .tab-item:nth-child(1) {
    @apply .rounded-r-none
  }
  .tab-item:nth-child(2) {
    @apply .border-r-0
  }
  .tab-item.router-link-active {
    @apply .border-b-2 .border-blue-dark
  }
  .tab-item:hover {
    @apply .border-b-2 .border-blue-dark .bg-grey-lighter
  }

</style>


