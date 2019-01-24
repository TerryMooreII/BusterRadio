<template>
  <div class="flex-col">
    <Loading v-if="loading" />
    <div class="flex py-4 px-3 hover:bg-grey-lighter cursor-pointer"
          v-for="show in shows"
          :key="show.identifier"
          @click="getShow(show.identifier)"
          v-if="shows.length">
      <div class="w-2/3">
        {{show.source}} <br />
        <span class="text-grey-dark text-sm">Published {{show.publicdate | dateformat}} <span v-if="show.publisher"> by {{show.publisher}}</span></span>
      </div>
      <div class="w-1/3 text-right" >
        <Stars cssClass="h-4 w-4" :rank="show.avg_rating" />
        <span class="text-grey-dark text-sm">{{show.downloads}} downloads</span>
      </div>
    </div>
    <div v-if="!loading && !shows.length" class="text-grey-darker text-sm">
      No Alternate Shows
    </div>
  </div>
</template>

<script>
import ArchiveApi from '../api/archive';
import Stars from './Stars';
import Loading from './Loading';

export default {
  name: 'Recordings',
  components: {
    Stars,
    Loading
  },
  props: {
    date: {
      type: [Date, String],
      default: null
    },
    artist: {
      type: Object,
      default() {
        return {};
      }
    },
    filter: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      shows: null,
      loading: true
    };
  },
  methods: {
    getShow(identifier) {
      this.$router.push(`/${this.artist.identifier}/${this.$route.params.year}/${identifier}`);
    }
  },
  mounted() {
    ArchiveApi.getShowsByDate(this.artist.identifier, new Date(this.date).toISOString())
      .then((shows) => {
        this.shows = shows.filter(show => show.identifier !== this.filter);
        this.loading = false;
      });
  }
};
</script>
