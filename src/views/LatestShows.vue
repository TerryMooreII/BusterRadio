<template>
  <div class="flex-col w-full px-0 sm:px-24 py-2 sm:mt-0 mt-3 overflow-scroll">
    <div class="flex antialiased text-grey-darkest py-6 px-2 sm:px-0 sticky pin-t w-full bg-white">
      <div class="w-2/3">
        <h2>Lastest Uploaded Shows</h2>
      </div>
      <div class="text-right w-1/3 ">
        <router-link to="/newest?orderby=date" class="text-grey-darker text-sm no-underline hover:underline" v-if="orderby === 'publicdate'">Sort By Show Date</router-link>
        <router-link to="/newest?orderby=publicdate" class="text-grey-darker text-sm  no-underline hover:underline" v-if="orderby === 'date'">Sort By Publish Date</router-link>
      </div>
    </div>
    <div class="flex items-stretch flex-wrap justify-center">
      <Loading v-if="!shows.length" />
      <ShowCard v-for="show of shows" :key="show.identifier" :show="show"/>
    </div>
  </div>
</template>

<script>
import ArchiveApi from '../api/archive';
import icons from '../icons';
import ShowCard from '@/components/ShowCard.vue';
import Loading from '../components/Loading';

export default {
  name: 'LatestShows',
  components: {
    Sort: icons.Sort,
    ShowCard,
    Loading
  },
  props: {
  },
  data() {
    return {
      shows: [],
      orderby: 'publicdate'
    };
  },
  methods: {
    query() {
      this.orderby = this.$route.query.orderby || 'publicdate';
      this.shows = [];
      ArchiveApi.getLatestShows(this.orderby).then(data => this.shows = data);
    }
  },
  watch: {
    '$route.query.orderby': function () {
      this.query();
    }
  },
  mounted() {
    this.query();
  }
};
</script>

<style scoped lang="less">

</style>
