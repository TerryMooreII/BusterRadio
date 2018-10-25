<template>
  <div class="flex-col w-full px-0 sm:px-24 sm:mt-0 mt-3 overflow-scroll">
    <div class="flex antialiased text-grey-darkest py-6 px-2 sm:px-16 sticky pin-t w-full bg-white z-10">
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
    <Pager :page="page" :count="shows.length" :pagesize="50" @onPageChange="pageChange" v-if="shows.length"/>
  </div>
</template>

<script>
import ArchiveApi from '../api/archive';
import icons from '../icons';
import ShowCard from '@/components/ShowCard.vue';
import Loading from '../components/Loading';
import Pager from '../components/Pager';

export default {
  name: 'LatestShows',
  components: {
    Sort: icons.Sort,
    ShowCard,
    Loading,
    Pager
  },
  props: {
  },
  data() {
    return {
      shows: [],
      orderby: 'publicdate',
      page: this.$route.query.page ? parseInt(this.$route.query.page, 10) : 1
    };
  },
  methods: {
    query() {
      this.orderby = this.$route.query.orderby || 'publicdate';
      this.shows = [];
      ArchiveApi.getLatestShows(this.orderby, this.$route.query.page).then(data => this.shows = data);
    },
    pageChange(page) {
      if (page == null) {
        return;
      }
      const query = Object.assign({}, this.$route.query, { page });
      this.$router.push({ name: 'newest', query });
    }
  },
  watch: {
    '$route.query.orderby': function () {
      this.query();
    },
    '$route.query.page': function () {
      this.query();
    }
  },
  mounted() {
    this.query();
  }
};
</script>
