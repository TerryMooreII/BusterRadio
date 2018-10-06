<template>
  <div>
    <Navbar class="block sm:hidden" @menu="() => this.show = !this.show"/>
   <div class="flex pb-24 pt-16 sm:pt-0 h-screen">
    <!-- <button class="z-50 fixed block sm:hidden mt-2 ml-3 " @click="show = !show">
       <Menu v-if="!show" v-bind:cssClass="'h-6 w-6 fill-current text-grey-dark inline-block self-center'"/>
       <Close v-if="show" v-bind:cssClass="'h-6 w-6 fill-current text-white inline-block self-center'"/>
    </button> -->
    <Sidenav :show="show"  @close="() => this.show = false"/>
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
