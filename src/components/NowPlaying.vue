<template>
  <div class="flex">
   <img class="img -mt-px" src="https://archive.org/services/img/StringCheeseIncident" alt="">
    <div class="leading-normal ml-2 mt-3 overflow-hidden">
      <div class="text-grey-darkest antialiased font-bold">Eyes Of the World</div>
      <div class="text-grey-dark antialiased text-sm">Grateful Dead</div>
      <div class="text-grey-dark antialiased text-sm">Ervin J. Nutter Center</div> 
    </div>
  </div>

</template>

<script>
export default {
  name: 'NowPlaying',
  props: {
    song: Object,
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
  img {
    height: 97px;
    width: 97px;
  }
</style>
