<template>
  <div>
    
   <div class="flex pb-24 h-screen">
    <Sidenav /> 
      <router-view/>  
  </div>
  <Footer />
</div>
  
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidenav from '@/components/Sidenav.vue'
import Footer from '@/components/Footer.vue'
import { mapState, mapActions } from 'vuex'


export default {
  name: 'home',
  components: {
    Navbar,
    Sidenav,
    Footer
  },
  data() {
    return {
    }
  },
  computed: mapState({
    artists: state => state.artists.all
  }),
  created () {
    if (!localStorage.artists) {
      this.$store.dispatch('artists/getArtists');
    }
  }
};
</script>

<style>
  
</style>
