<template>
  <Container :wide="true">
    <template slot="header">
      <div class="w-2/3">
        <h2>Lastest Shows</h2>
      </div>
      <div class="text-right w-1/3 ">
        <router-link to="/newest?orderby=date" class="text-grey-darker text-sm no-underline hover:underline" v-if="orderby === 'publicdate'">Sort By Show Date</router-link>
        <router-link to="/newest?orderby=publicdate" class="text-grey-darker text-sm  no-underline hover:underline" v-if="orderby === 'date'">Sort By Upload Date</router-link>
      </div>
    </template>
    <div class="flex items-stretch flex-wrap justify-center">
      <Loading v-if="!shows.length" />
      <ShowCard v-for="show of shows" :key="show.identifier" :show="show"/>

    </div>
    <Pager :page="page" :count="shows.length" :pagesize="50" @onPageChange="pageChange" v-if="shows.length"/>
  </Container>
</template>

<script>
import ShowCard from '@/components/ShowCard.vue';
import ArchiveApi from '../api/archive';
import Loading from '../components/Loading';
import Pager from '../components/Pager';
import Container from '../components/Container';

export default {
  name: 'LatestShows',
  components: {
    Container,
    ShowCard,
    Loading,
    Pager
  },
  data() {
    return {
      shows: [],
      orderby: 'date',
      page: this.$route.query.page ? parseInt(this.$route.query.page, 10) : 1
    };
  },
  methods: {
    query() {
      this.orderby = this.$route.query.orderby || 'date';
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
