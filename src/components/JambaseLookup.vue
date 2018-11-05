<template>
  <a :href="url" :class="$attrs.class" :title="title" target="_blank">
    <Zondicons icon="Ticket" class="h-5 w-5 fill-current inline-block text-grey-darker"/>
  </a>
</template>

<script>
import Zondicons from '../icons/Zondicons';

export default {
  name: 'JambaseLookup',
  components: {
    Zondicons
  },
  props: {
    artist: {
      type: Object
    }
  },
  computed: {
    url() {
      return `http://jambase.com/band/${this.artist.title.toLowerCase().replace(/ /g, '-')}`;
    },
    title() {
      return `Lookup Concerts for ${this.artist.title} (Experimental)`;
    }
  }
};
</script>

<style scoped lang="less">

</style>
