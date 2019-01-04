<template>
  <Container :wide="true">
    <template slot="header">
      <FavoritesTabs />
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
import FavoritesTabs from '../components/FavoritesTabs';
import helpers from '../services/helpers';

export default {
  name: 'FavoriteShows',
  components: {
    Container,
    ShowCard,
    Loading,
    FavoritesTabs
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
    helpers.setTitle('Favorite Shows');
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
