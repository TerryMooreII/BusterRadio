<template>
  <div class="flex-grow px-24 py-2 overflow-scroll">
    <h2 class="antialiased text-grey-darkest py-6 sticky pin-t w-full bg-white">Lastest Uploaded Shows</h2>
    <div class="flex items-stretch flex-wrap justify-center">
      <Show v-for="show of shows" :key="show.identifier" :show="show"/>
    </div>
  </div>
</template>

<script>
import ArchiveApi from '../api/archive';
import Show from '@/components/Show.vue'

export default {
  name: 'LatestShows',
  components: {
    Show
  },
  props: {
  },
 data() {
    return {
      shows: []
    }
  },
  beforeCreate() {
    ArchiveApi.getLatestShows().then(data => this.shows = data);
  }
};
</script>

<style scoped lang="less">

</style>
