<template>
  <div>
    <Zondicons icon="Star" :class="clazz" v-for="i in stars" :key="i" />
    <span class="text-grey text-sm italic" v-if="!stars">Not Rated</span>
  </div>
</template>

<script>
import Zondicons from '../icons/Zondicons';

export default {
  name: 'Stars',
  components: {
    Zondicons
  },
  props: {
    rank: [String, Number],
    cssClass: String
  },
  computed: {
    clazz() {
      return this.cssClass + ' ' + 'text-yellow-dark fill-current';
    },
    stars() {
      if (!this.rank) {
        return 0;
      }

      return Math.round(this.rank);
    }
  }
};
</script>

<style scoped lang="less">

</style>
