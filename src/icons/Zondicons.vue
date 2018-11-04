<template>
  <svg :class="$attrs.class" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <component v-bind:is="icon"/>
  </svg>
</template>

<script>
import icons from './index';

export default {
  name: 'Zondicons',
  components: {
    ...icons
  },
  props: {
    icon: String
  }
};
</script>