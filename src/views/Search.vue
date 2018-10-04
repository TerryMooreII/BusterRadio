<template>
  <div class="flex-grow px-0 sm:px-24 py-2 sm:mt-0 mt-3 overflow-scroll">
    <div class="flex antialiased text-grey-darkest px-2 sm:px-0 py-6 sticky pin-t w-full bg-white border-b border-solid border-grey-light">
      <div class="flex-col">
        <h2 class="flex-auto flex-grow">
          Search for Artists and Venues
        </h2>
          <div class="flex">
            <input type="text"
                   class="flex-auto border-none h-24 flex-auto text-grey-darkest"
                   placeholder="Start typing..."
                   v-model="q" autofocus />
          </div>
      </div>
    </div>
    <div class="flex items-stretch flex-wrap justify-center">
      <Artist v-for="artist in results" :key="artist.identifer" :artist="artist" />
    </div>

      <NoResults v-if="results.length === 0 &&  q && q.length > 2" width="362px">
        <Search v-bind:cssClass="'h-24 w-24 fill-current block ml-2'" slot="icon"/>
        <p> No Results Found.</p><br>
        <p>Try Searching Again.</p>
    </NoResults>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Artist from '../components/Artist';
import icons from '../icons';
import NoResults from '../components/NoResults';


export default {
  name: 'search',
  components: {
    Artist,
    NoResults,
    Search: icons.Search
  },
  data() {
    return {
      q: null,
      results: []
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
      this.$router.push(`/search?q=${this.q}`);
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
  input {
    font-size:50px
  }
  *:focus {
    outline: none
  }
</style>
