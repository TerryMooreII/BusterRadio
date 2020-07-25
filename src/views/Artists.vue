<template>
   <Container :wide="true">
     <template slot="header">
      <div class="w-2/3">
        <h2>Artists <small class="text-grey-dark">({{total}})</small></h2>
      </div>
      <div class="text-right w-1/3 ">
        <router-link to="/artists?orderby=a-to-z" class="text-grey-darker text-sm no-underline hover:underline"  v-if="!$route.query.orderby">Sort by A-Z</router-link>
        <router-link to="/artists" class="text-grey-darker text-sm  no-underline hover:underline" v-if="$route.query.orderby === 'a-to-z'">Sort By Popularity</router-link>
      </div>
    </template>
    <div class="flex items-stretch flex-wrap justify-center">
      <Artist v-for="artist of artistsList" :key="artist.identifier" :artist="artist" />
    </div>
   </Container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Artist from '../components/Artist.vue';
import Container from '../components/Container.vue';
import helpers from '../services/helpers';

export default {
  name: 'Artists',
  components: {
    Container,
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
      artists: (state) => state.artists.all
    }),
    ...mapGetters('artists', {
      artistsByDownloads: 'artistsByDownloads',
      total: 'total'
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
        this.index += count;
      }
    },
    getOrderByDownloads() {
      const count = 100;
      if (this.artistsList.length <= this.artistsByDownloads.length) {
        this.artistsList.push(...this.artistsByDownloads.slice().splice(this.index, count));
        this.index += count;
      }
    },
    handleScroll() {
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
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
    helpers.setTitle('Artists');
    this.getArtists();
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
