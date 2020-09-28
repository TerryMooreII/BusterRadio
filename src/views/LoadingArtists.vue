<template>
  <div class="loading-container flex justify-center">
    <div class="flex mt-32 flex-col">
      <Loading />
      <h2 class="flex p-25 text-2xl">Updating the Live Music Catalog</h2>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue';
import moment from 'moment';
import { mapState } from 'vuex';
import store from '../store';

export default {
  name: 'home',
  components: {
    Loading
  },
  data() {
    return {
    };
  },
  computed: mapState({
    artists: (state) => state.artists.all
  }),
  mounted() {
    if (!localStorage.artists || !localStorage.artistFetch || moment().diff(parseInt(localStorage.artistFetch, 10), 'weeks') >= 1) {
      localStorage.setItem('artistFetch', Date.now());
      store.dispatch('artists/getArtists')
        .then(() => this.$router.push(this.$route.query.redirect));
    } else {
      this.$router.push(this.$route.query.redirect);
    }
  }
};
</script>

<style lang="less" scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  opacity: .75;
}
</style>
