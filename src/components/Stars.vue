<template>
  <div>
    <Star :cssClass="cssClass" v-for="i in stars" :key="i" />
    <span class="text-grey text-sm italic" v-if="!stars">Not Rated</span>
  </div>
</template>

<script>
import icons from '../icons';

export default {
  name: 'Stars',
  components: {
    Star: icons.Star
  },
  props: {
    rank: [String, Number],
    cssClass: String
  },
  computed: {
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
