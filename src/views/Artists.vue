<template>
   <div id="artists" class="flex-grow px-0 sm:px-24 py-2 sm:mt-0 mt-3 overflow-scroll">
     <div class="flex antialiased text-grey-darkest px-2 sm:px-0 py-6 sticky pin-t w-full bg-white z-10">
      <div class="w-2/3">
        <h2>Artists</h2>
      </div>
      <div class="text-right w-1/3 ">
        <router-link to="/?orderby=a-to-z" class="text-grey-darker text-sm no-underline hover:underline"  v-if="!$route.query.orderby">Sort by A-Z</router-link>
        <router-link to="/" class="text-grey-darker text-sm  no-underline hover:underline" v-if="$route.query.orderby === 'a-to-z'">Sort By Popularity</router-link>
      </div>
    </div>
    <div class="flex items-stretch flex-wrap justify-center">
      <Artist v-for="artist of artistsList" :key="artist.identifier" :artist="artist" />
    </div>
   </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Artist from '../components/Artist.vue';

export default {
  name: 'Artists',
  components: {
    Artist
  },
  data() {
    return {
      index: 0,
      artistsList: [],
      el: null
    };
  },
  computed: {
    ...mapState({
      artists: state => state.artists.all
    }),
    ...mapGetters('artists', {
      artistsByDownloads: 'artistsByDownloads'
    })
  },
  methods: {
    getArtists() {
      if (this.$route.query.orderby === 'a-to-z') {
        this.getArtistAlphabetized();
      } else {
        this.getOrderByDownloads();
      }
    },
    getArtistAlphabetized() {
      const count = 100;
      if (this.artistsList.length <= this.artists.length) {
        this.artistsList.push(...this.artists.slice().splice(this.index, count));
        this.index = this.index + count;
      }
    },
    getOrderByDownloads() {
      const count = 100;
      if (this.artistsList.length <= this.artistsByDownloads.length) {
        this.artistsList.push(...this.artistsByDownloads.slice().splice(this.index, count));
        this.index = this.index + count;
      }
    },
    handleScroll() {
      if (this.el.scrollHeight - this.el.scrollTop === this.el.clientHeight) {
        this.getArtists();
      }
    }
  },
  watch: {
    '$route.query.orderby': function () {
      this.artistsList = [];
      this.index = 0;
      this.getArtists();
    }
  },
  mounted() {
    this.getArtists();
    this.el = document.querySelector('div#artists');
    window.addEventListener('wheel', this.handleScroll);
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('wheel', this.handleScroll);
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style scoped lang="less">
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
