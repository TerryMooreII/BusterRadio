<template>
   <div id="artists" class="flex-grow px-24 py-2 overflow-scroll">
     <div class="flex antialiased text-grey-darkest py-6 sticky pin-t w-full bg-white">
      <div class="w-2/3">
        <h2>Artists</h2>
      </div>
      <div class="text-right w-1/3 ">
        <router-link to="/?orderby=downloads" class="text-grey-darker text-sm no-underline hover:underline"  v-if="!$route.query.orderby">Sort By Popularity</router-link>
        <router-link to="/" class="text-grey-darker text-sm  no-underline hover:underline" v-if="$route.query.orderby === 'downloads'">Sort by A-Z</router-link>
      </div>
    </div>
    <div class="flex items-stretch flex-wrap justify-center">
      <Artist v-for="artist of artistsList" :key="artist.identifier" :artist="artist"/>
    </div>
   </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
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
      if (this.$route.query.orderby === 'downloads') {
        this.getOrderByDownloads();
      } else {
        this.getArtistAlphabetized();
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
