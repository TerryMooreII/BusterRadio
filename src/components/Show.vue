<template>
    <div class="show overflow-hidden mx-4 my-4">
      <img class="" v-bind:src="imageUrl">
      <div class="p-1">
        <div class="antialiased font-bold text-sm mb-1">{{show.creator}}</div>
        <p class="text-sm leading-tight">
        <span class="subpixel-antialiased date text-grey-darkest text-xs italic">{{date}}</span> <br />  
          <span class="antialiased text-grey-darker">{{venue}}</span> <br />
          <span class="antialiased text-grey-dark italic">{{show.coverage}}</span> &nbsp;
        </p>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Show',
  props: {
    show: Object,
  },
  computed: {
    date() {
      if (!this.show.date){
        return '';
      }
      return this.show.date.split('T')[0];
    },
    venue() {
      const re = /([A-Za-z\W+0-9]+) Live at ([A-Za-z\W+0-9]+) on/;
      const match = re.exec(this.show.title);
      return match.length >= 3 ? match[2] : '';
    },
    imageUrl() {
      const artists = JSON.parse(localStorage.getItem('artists'));
      const artist = artists.find(artist => artist.title === this.show.creator);
      return 'https://archive.org/services/img/' + artist.identifier;
    }
  },
  data () {
    return {};
  },
  methods: {

  }
};
</script>

<style scoped lang="less">
  img{ 
    height: 155px;
    width: 155px;
  }
  .show {
    width:155px
  }
</style>
