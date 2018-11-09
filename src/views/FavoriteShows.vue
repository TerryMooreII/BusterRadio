<template>
  <Container :wide="true">
    <template slot="header">
      <div class="w-2/3">
        <h2>Favorite Shows</h2>
      </div>
    </template>
    <div class="flex items-stretch flex-wrap justify-center">
      <Loading v-if="!shows" />
      <ShowCard v-for="show of shows" :key="show.identifier" :show="show"/>
    </div>
  </Container>
</template>

<script>
import ShowCard from '@/components/ShowCard.vue';
import datastore from '../services/datastore';
import Loading from '../components/Loading';
import Container from '../components/Container';

export default {
  name: 'FavoriteShows',
  components: {
    Container,
    ShowCard,
    Loading
  },

  data() {
    return {
      shows: null
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

<style scoped lang="less">
  .right {
    position: absolute;
    right: 4px;
    top: 4px;
  }
</style>
