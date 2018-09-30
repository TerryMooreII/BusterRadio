<template>
  <div class="flex-grow px-0 sm:px-24 py-2 overflow-scroll">
    <div class="flex antialiased text-grey-darkest px-2 sm:px-0 py-6 sticky pin-t w-full bg-white border-b border-solid border-grey-light">
      <div class="flex-col">
        <h2 class="flex-auto flex-grow">
          Search for Artists and Venues
        </h2>
          <div class="flex">
            <input type="text"
                   class="flex-auto border-none h-24 flex-auto text-grey-darkest"
                   placeholder="Start typing..."
                   v-model="q" />
          </div>
      </div>
    </div>
    <div class="flex items-stretch flex-wrap justify-center">
      <Artist v-for="artist in results" :key="artist.identifer" :artist="artist" />
    </div>

    <h2 v-if="results.length === 0 &&  q && q.length > 2" class="flex justify-center pt-8 text-grey-darkest italic">
        No Results.  Try Searching Again.
      </h2>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Artist from '../components/Artist';
import icons from '../icons';

export default {
  name: 'search',
  components: {
    Artist,
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
