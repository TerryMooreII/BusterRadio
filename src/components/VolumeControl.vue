<template>
   <div class="flex flex-grow">
    <VolumeDown v-bind:cssClass="'h-5 w-5 fill-current text-grey-dark inline-block self-center mr-1 -mt-2'" />
    <div class="h-1 bg-grey-lighter w-2/3 rounded relative">
      <div class="rounded bg-blue h-1" style="width: 50%;"></div>
    </div>
   </div>
  
</template>

<script>
import icons from '../icons';

export default {
  name: 'VolumeControl',
  components: {
    VolumeDown: icons.VolumeDown,
  },
  props: {
  
  },
  data () {
    return {
      
    }
  },
  methods: {

  }
};
</script>

<style scoped lang="less">
  .dot {
    top: -1px;
  }
</style>
