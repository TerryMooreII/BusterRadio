<template>
  <Container :wide="true">

    <template slot="header">
      <div class="flex-col w-full">
        <!-- <label>Search for Artists</label> -->
        <div class="relative">
          <!-- <Search v-bind:cssClass="'h-5 w-5 fill-current block absolute mt-5 ml-3'"/> -->
          <Zondicon icon="Search" class="h-5 w-5 fill-current block absolute mt-5 ml-3"/>
          <input type="text"
                class="p-3 pl-10 w-full text-grey-darkest mt-2 rounded border border-grey w-full"
                placeholder="Search for Artists, Venues, or Songs"
                v-model="q" autofocus />
        </div>
        <div class="flex justify-between" v-if="!isAdvanceQuery">
          <router-link :to="{ name: 'search', query: { q } }" class="tab-item">
            Top Results
          </router-link>
          <router-link :to="{ name: 'search-artists', query: { q } }" class="tab-item">
            Artists
          </router-link>
          <router-link :to="{ name: 'search-locations', query: { q } }" class="tab-item">
            Location
          </router-link>
          <router-link :to="{ name: 'search-songs', query: { q } }" class="tab-item">
            Songs
          </router-link>
        </div>
      </div>
    </template>

    <div v-if="artists.length">
      <h2 class="" v-if="isTopResults()">Artists</h2>
      <div class="flex items-stretch flex-wrap justify-center">
        <Artist v-for="artist in artists" :key="artist.identifer" :artist="artist" />
      </div>
    </div>

    <div v-if="venues.length">
      <h2 class="" v-if="isTopResults()">Locations</h2>
      <div class="flex items-stretch flex-wrap justify-center">
        <ShowCard v-for="show of venues" :key="show.identifier" :show="show"/>
        <Pager :page="page" :count="venues.length" :pagesize="50" @onPageChange="pageChange" v-if="venues.length && !isTopResults()"/>
      </div>
    </div>

    <div v-if="songs.length">
      <h2 class="" v-if="isTopResults()">Songs</h2>
      <div class="flex items-stretch flex-wrap justify-center">
        <ShowCard v-for="show of songs" :key="show.identifier" :show="show"/>
         <Pager :page="page" :count="songs.length" :pagesize="50" @onPageChange="pageChange" v-if="songs.length && !isTopResults()"/>
      </div>
    </div>

    <div v-if="advResults.length">
      <h2 class="" v-if="isTopResults()">Advanced Search Results</h2>
      <div class="flex items-stretch flex-wrap justify-center">
        <ShowCard v-for="show of advResults" :key="show.identifier" :show="show"/>
         <Pager :page="page" :count="advResults.length" :pagesize="50" @onPageChange="pageChange" v-if="advResults.length"/>
      </div>
    </div>

    <NoResults v-if="!artists.length && !venues.length && !songs.length && !advResults.length && q && q.length > 2" width="362px">
      <Zondicon icon="Search" class="h-24 w-24 fill-current block ml-2" slot="icon"/>
      <p class="leading-loose"> No Results Found. <br> Try Searching Again. </p>
    </NoResults>
  </Container>
</template>

<script>
import { mapGetters } from 'vuex';
import ShowCard from '@/components/ShowCard.vue';
import Pager from '@/components/Pager.vue';
import Artist from '../components/Artist';
import NoResults from '../components/NoResults';
import Container from '../components/Container';
import archive from '../api/archive';
import helpers from '../services/helpers';

export default {
  name: 'search',
  components: {
    Artist,
    NoResults,
    Container,
    ShowCard,
    Pager
  },
  data() {
    return {
      q: null,
      artists: [],
      debounce: null,
      venues: [],
      songs: [],
      advResults: [],
      isAdvanceQuery: false,
      page: this.$route.query.page ? parseInt(this.$route.query.page, 10) : 1
    };
  },
  computed: {
    ...mapGetters('artists', {
      search: 'search'
    })
  },
  watch: {
    '$route.query.q': function (val) {
      this.q = val;
      this.submit();
    },
    '$route.query.page': function (val) {
      this.page = val;
      this.submit();
    },
    '$route.name': function () {
      this.reset();
      this.submit();
    },
    q() {
      if (this.debounce) clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        const { name } = this.$route;
        this.$router.push({ name, query: { q: this.q } });
      }, 400);
    }
  },
  methods: {
    parseQuery() {
      if (!this.$route.query.q) {
        return null;
      }

      if (!this.$route.query.q.includes(':')) {
        this.isAdvanceQuery = false;
      } else {
        this.isAdvanceQuery = true;
      }

      return this.$route.query.q;
    },
    isTopResults() {
      return this.$route.name === 'search';
    },
    reset() {
      this.artists = [];
      this.venues = [];
      this.songs = [];
      this.advResults = [];
      this.page = 1;
    },
    parseSongs(data) {
      return data;
    },
    getArtists() {
      this.artists = this.search(this.q).splice(0, 30);
    },
    getLocations() {
      archive.search({
        property: ['venue', 'coverage'], searchTerm: this.q, count: this.isTopResults() ? 10 : 50, page: this.page
      })
        .then((data) => this.venues = data);
    },
    getSongs() {
      archive.search({
        property: 'description', searchTerm: this.q, count: this.isTopResults() ? 10 : 50, page: this.page
      })
        .then((data) => this.songs = this.parseSongs(data));
    },
    pageChange(page) {
      if (page == null) {
        return;
      }
      const query = { ...this.$route.query, page };
      this.$router.push({ name: this.$route.name, query });
    },
    advancedSearch(q) {
      // this.reset();
      const getCriteria = (item) => {
        const aIdx = item.indexOf('artist:');
        const sIdx = item.indexOf('song:');
        const lIdx = item.indexOf('location:');

        const idx = [];

        if (aIdx !== -1) idx.push(aIdx);
        if (sIdx !== -1) idx.push(sIdx);
        if (lIdx !== -1) idx.push(lIdx);

        return idx.sort().map((v, k) => {
          if (k + 1 === idx.length) {
            return item.substr(v);
          }
          return item.substring(v, idx[k + 1]);
        }).reduce((acc, item) => {
          const [key, val] = item.split(':');
          acc[key] = val.trim();
          return acc;
        }, {});
      };
      const c = getCriteria(q);

      archive.advancedSearch({
        artist: c.artist, location: c.location, song: c.song, count: 50, page: this.page
      })
        .then((data) => this.advResults = data);
    },
    submit() {
      const { name } = this.$route;
      if (this.q && this.q.length >= 3) {
        const advQuery = this.parseQuery();
        if (this.isAdvanceQuery) {
          this.advancedSearch(advQuery);
          return;
        }
        switch (name) {
          case 'search-artists':
            this.getArtists();
            break;
          case 'search-locations':
            this.getLocations();
            break;
          case 'search-songs':
            this.getSongs();
            break;
          default:

            this.getArtists();
            this.getLocations();
            this.getSongs();
        }
      }
    }
  },
  mounted() {
    helpers.setTitle('Search');
    if (this.$route.query.q) {
      this.q = this.$route.query.q;
      this.submit();
    }
  }
};
</script>

<style>
  *:focus {
    outline: none
  }
</style>

<style lang="postcss" scoped>
.tab-item {
  @apply .flex .w-1/4 .justify-center .items-center .pt-6 .pb-2 .border-b .border-grey .text-center .text-grey-darkest .no-underline
}
.tab-item.router-link-exact-active {
    @apply .border-b-2 .border-blue-dark
  }
</style>
