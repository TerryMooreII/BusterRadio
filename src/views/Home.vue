<template>
  <div>

   <div class="flex pb-24 h-screen">
    <Sidenav />
     <transition
        name="fade"
        mode="out-in">
        <router-view/>
      </transition>
  </div>
  <Footer />
</div>

</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Sidenav from '@/components/Sidenav.vue';
import Footer from '@/components/Footer.vue';
import { mapState, mapActions } from 'vuex';
import store from '../store';


export default {
  name: 'home',
  components: {
    Navbar,
    Sidenav,
    Footer
  },
  data() {
    return {
    };
  },
  computed: mapState({
    artists: state => state.artists.all
  }),
  beforeRouteEnter(to, from, next) {
    if (!localStorage.artists) {
      store.dispatch('artists/getArtists')
        .then(() => next());
    } else {
      next();
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
