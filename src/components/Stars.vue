<template>
  <div>
    <Zondicon icon="star-full" :class="clazz" v-for="i in stars" :key="i" />
    <span class="text-grey text-sm" v-if="!stars">Not Rated</span>
  </div>
</template>

<script>
export default {
  name: 'Stars',
  props: {
    rank: [String, Number],
    cssClass: String
  },
  computed: {
    clazz() {
      return `${this.cssClass} text-yellow-dark fill-current`;
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
