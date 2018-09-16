<template>
  <div id="artists" class="flex-grow px-24 py-2 overflow-scroll">
    <h2 class="antialiased text-grey-darkest py-6 sticky pin-t w-full bg-white">Years</h2>
    <div class="flex items-stretch flex-wrap justify-center">
      <ul>
        <li v-for="year of years" :key="year.year">
        {{year.year}} {{year.total}}
      </li>
      </ul>
    </div>
   </div>
</template>

<script>

import ArchiveApi from '../api/archive';
export default {
  name: 'home',
  components: {
  },
  data() {
    return {
      years: []
    }
  },
  mounted(){
    ArchiveApi.getYears(this.$route.params.artistId).then(data => this.years = data);
  }
};
</script>

<style>
  
</style>
