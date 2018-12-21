<template>
  <div>
    <Navbar class="block sm:hidden" @menu="() => this.show = !this.show"/>
    <Sidenav :show="show" @close="() => this.show = false"/>
    <div class="flex pb-32 main">
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
import { mapState } from 'vuex';
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


.main {
  padding-left: 240px;
}

@media (min-width: 1500px) {
  .xxl\:mx-64 {
    margin-right: 16rem !important;
    margin-left: 16rem !important;
  }
}

@media (max-width: 576px) {
  .main {
    padding-top: 48px;
    padding-left: 0px;
  }
  .pin-t {
    top: 64px !important;
  }
}
</style>
