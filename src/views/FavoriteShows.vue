<template>
  <div class="flex-col w-full px-0 sm:px-24 sm:mt-0 mt-3 overflow-scroll">
    <div class="flex antialiased text-grey-darkest py-6 px-2 sm:px-16 sticky pin-t w-full bg-white z-100">
      <div class="w-2/3">
        <h2>Favorite Shows</h2>
      </div>
    </div>
    <div class="flex items-stretch flex-wrap justify-center">
      <Loading v-if="!shows" />
      <ShowCard v-for="show of shows" :key="show.identifier" :show="show"/>
    </div>
  </div>
</template>

<script>
import datastore from '../services/datastore';
import ShowCard from '@/components/ShowCard.vue';
import Loading from '../components/Loading';

export default {
  name: 'FavoriteShows',
  components: {
    ShowCard,
    Loading
  },

  data() {
    return {
      shows: null,
    };
  },
  methods: {
    async query() {
      this.shows = await datastore.getFavoriteShows();
    }
  },
  mounted() {
    this.query();
  }
};
</script>

<style scoped>
  .right {
    position: absolute;
    right: 4px;
    top: 4px;
  }
</style>

