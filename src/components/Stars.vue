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
      const MAX_STARS = 5;
      if (!this.rank) {
        return 0;
      }

      return Math.round(this.rank);
      this.openStars = MAX_STARS - this.stars;
    }
  }
};
</script>

<style scoped lang="less">

</style>
