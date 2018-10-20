<template>
  <div>
    <Navbar class="block sm:hidden" @menu="() => this.show = !this.show"/>
   <div class="flex pb-24 pt-16 sm:pt-0 h-screen">
    <Sidenav :show="show" @close="() => this.show = false"/>
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
import moment from 'moment';
import Navbar from '@/components/Navbar.vue';
import Sidenav from '@/components/Sidenav.vue';
import Footer from '@/components/Footer.vue';
import { mapState, mapActions } from 'vuex';
import store from '../store';
import icons from '../icons';

export default {
  name: 'home',
  components: {
    Navbar,
    Sidenav,
    Footer,
    Menu: icons.Menu,
    Close: icons.Close
  },
  data() {
    return {
      show: false
    };
  },
  computed: mapState({
    artists: state => state.artists.all
  }),
  beforeRouteEnter(to, from, next) {
    if (!localStorage.artists || !localStorage.artistFetch || moment().diff(parseInt(localStorage.artistFetch, 10), 'weeks') >= 1) {
      localStorage.setItem('artistFetch', Date.now());
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
