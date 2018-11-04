<template>
  <Container :wide="true">

    <template slot="header">
      <div class="flex-col w-full">
            <label>Search for Artists</label>
            <div class="relative">
              <Search v-bind:cssClass="'h-5 w-5 fill-current block absolute mt-5 ml-3'"/>
              <input type="text"
                   class="p-3 pl-10 w-full text-grey-darkest mt-2 rounded border border-grey w-full"
                   placeholder="Search"
                   v-model="q" autofocus />
            </div>
      </div>
    </template>

    <div class="flex items-stretch flex-wrap justify-center">
      <Artist v-for="artist in results" :key="artist.identifer" :artist="artist" />
    </div>

    <NoResults v-if="results.length === 0 &&  q && q.length > 2" width="362px">
      <Search v-bind:cssClass="'h-24 w-24 fill-current block ml-2'" slot="icon"/>
      <p class="leading-loose"> No Results Found. <br> Try Searching Again. </p>
    </NoResults>
  </Container>
</template>

<script>
import { mapGetters } from 'vuex';
import Artist from '../components/Artist';
import icons from '../icons';
import NoResults from '../components/NoResults';
import Container from '../components/Container';


export default {
  name: 'search',
  components: {
    Artist,
    NoResults,
    Search: icons.Search,
    Container
  },
  data() {
    return {
      q: null,
      results: [],
      debounce: null
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
    q() {
      if (this.debounce) clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.$router.push(`/search?q=${this.q}`);
      }, 400);
    }
  },
  methods: {
    submit() {
      if (this.q.length >= 3) {
        this.results = this.search(this.q).splice(0, 30);
      } else if (this.q.length === 0) {
        this.results = [];
      }
    }
  },
  mounted() {
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
