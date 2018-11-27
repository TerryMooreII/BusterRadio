<template>
  <a :href="url" :class="$attrs.class" :title="title" target="_blank">
    <span :class="{'flex item-center': $attrs.label}">
      <Zondicon icon="Ticket" class="h-5 w-5 fill-current inline-block text-grey-darker"/>
      <span class="inline-block ml-2" v-if="$attrs.label">{{$attrs.label}}</span>
    </span>
  </a>
</template>

<script>

export default {
  name: 'JambaseLookup',
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
