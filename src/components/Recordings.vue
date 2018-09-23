<template>
  <Modal @dismiss="$emit('dismiss')">
    <template slot="header">
      <div class="px-3 mb-4">
        <h3 class="">
          {{recordings.venue}} <br>
          <span class="text-sm text-grey-darker">{{recordings.date | dateformat}}</span>
        </h3>
      </div>
    </template>
    <div class="flex-col">
      <Loading v-if="!shows.length" />
      <div class="flex py-4 px-3 hover:bg-grey-lighter cursor-pointer" v-for="show in shows" :key="show.identifier" @click="getShow(show.identifier)">
        <div class="w-2/3">
          {{show.source}} <br />
          <span class="text-grey-dark italic text-sm">Published {{show.publicdate | dateformat}} <span v-if="show.publisher"> by {{show.publisher}}</span></span>
        </div>
        <div class="w-1/3 text-right" >
          <Stars cssClass="h-4 w-4" :rank="show.avg_rating" />
          <span class="text-grey-dark italic text-sm">{{show.downloads}} downloads</span>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import ArchiveApi from '../api/archive';
import Modal from './Modal';
import Stars from './Stars';
import Loading from './Loading';

export default {
  name: 'Recodings',
  components: {
    Modal,
    Stars,
    Loading
  },
  props: {
    recordings: {
      type: Object, 
      default: {}
    },
    artist: {
      type: Object, 
      default: {}
    }
  },
  data () {
    return {
      shows: []
    }
  },
  methods: {
    getShow(identifier){
      this.$router.push(`${this.$route.params.year}/${identifier}`)
    }
  },
  mounted() {
    ArchiveApi.getShowsByDate(this.artist.identifier, this.recordings.date)
      .then (shows => this.shows = shows);
  }
};
</script>

<style scoped lang="less">

</style>
