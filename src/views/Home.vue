<template>
  <div>
    <Navbar class="block md:hidden" @menu="() => this.show = !this.show"/>
    <div class="flex">
      <Sidenav :show="show" @close="() => this.show = false"/>
      <div class="flex w-full pb-32 main mr-0 md:mr-20 xl:mr-0">
        <transition
          name="fade"
          mode="out-in">
          <router-view/>
        </transition>
      </div>
      <!-- <div class="w-285 hidden xl:block"></div> -->
    </div>
  <Footer />
  </div>

</template>

<script>
// import moment from 'moment';
import Navbar from '@/components/Navbar.vue';
import Sidenav from '@/components/Sidenav.vue';
import Footer from '@/components/Footer.vue';
import { mapState } from 'vuex';
// import store from '../store';

export default {
  name: 'home',
  components: {
    Navbar,
    Sidenav,
    Footer
  },
  data() {
    return {
      show: false
    };
  },
  computed: mapState({
    artists: (state) => state.artists.all
  })
  // beforeRouteEnter(to, from, next) {
  //   if (!localStorage.artists || !localStorage.artistFetch || moment().diff(parseInt(localStorage.artistFetch, 10), 'weeks') >= 1) {
  //     localStorage.setItem('artistFetch', Date.now());
  //     store.dispatch('artists/getArtists')
  //       .then(() => next());
  //   } else {
  //     next();
  //   }
  // }
};
</script>

<style lang="less">
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

.w-285 {
    min-width: 285px;
  }
.main {
  // padding-left: 75px;
  // padding-right: 75px;
}

@media (min-width: 1500px) {
  // .xxl\:mx-64 {
  //   margin-right: 16rem !important;
  //   margin-left: 16rem !important;
  // }
}

@media (max-width: 776px) {
  .main {
    padding-top: 48px;
    padding-left: 0px;
  }
  .pin-t {
    top: 64px !important;
  }
}
</style>
