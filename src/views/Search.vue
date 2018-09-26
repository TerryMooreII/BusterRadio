<template>
  <div class="flex-grow px-24 py-2 overflow-scroll">
    <div class="flex antialiased text-grey-darkest py-6 sticky pin-t w-full bg-white border-b border-solid border-grey-light">
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
   
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Artist from '../components/Artist'
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
    }
  },
  computed: {
    ...mapGetters('artists', {
      search: 'search' 
    })
  },
  watch: {
    '$route.query.q'(val) {
      this.q = val;
      this.submit()
    },
    'q'() {
      this.$router.push(`/search?q=${this.q}`);
    }
  },
  methods: {
    submit(){
      if (this.q.length >= 3 ){
        this.results = this.search(this.q);
      }
    },
  },
  mounted() {
    if (this.$route.query.q){
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
