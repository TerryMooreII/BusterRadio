<template>
   <div id="artists" class="flex-grow px-24 py-2 overflow-scroll">
    <h2 class="antialiased text-grey-darkest py-6 sticky pin-t w-full bg-white">Artists</h2>
    <div class="flex items-stretch flex-wrap justify-center">
      <Artist v-for="artist of artistsList" :key="artist.identifier" :artist="artist"/>
    </div>
   </div>
</template>

<script>
import { mapState } from 'vuex'
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
    }
  },
  computed: mapState({
    artists: state => state.artists.all
  }),
  methods: {
    getArtists() {
      const count = 100;
      if (this.artistsList.length <= this.artists.length){
        this.artistsList.push(...this.artists.slice().splice(this.index, count));
        this.index = this.index + count;
      }
    },
    handleScroll () {
      if(this.el.scrollHeight - this.el.scrollTop === this.el.clientHeight) {
        this.getArtists();
      }      
    }
  },
  mounted() {
    this.getArtists();
    this.el = document.querySelector('div#artists');
     window.addEventListener('wheel', this.handleScroll);
     window.addEventListener('scroll', this.handleScroll);
  },
  created () {
   
  },
  destroyed () {
    window.removeEventListener('wheel', this.handleScroll);
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style scoped lang="less">

</style>
