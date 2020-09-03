<template>
  <Modal @dismiss="$emit('dismiss')">
    <template slot="header">
      <div class="flex-col flex w-full">
        <h3>
          <input type="text" :disabled="!isLoggedIn" v-model="station.title" placeholder="Station Name" class="title rounded w-full p-2"/>
        </h3>
        <input type="text"
          :disabled="!isLoggedIn"
          v-model="search"
          @input="onSearch()"
          placeholder="Search for Artists"
          class="border rounded w-full p-2 mt-3"/>
      </div>
    </template>
    <div class="flex flex-col">
        <div v-if="!isLoggedIn">
          <div class="text-center">
             Once logged in you can create as many radio stations as you wish and add as many artists to that station.
          Then we will auto generate the playlist for you based on those artist.
          </div>
          <NoResults v-if="artists.length === 0" width="361px">
            <Zondicon icon="Radio" class="h-24 w-24 fill-current block ml-2" slot="icon"/>
              You must be logged in to create radio stations.
          </NoResults>
        </div>
      <div class="flex items-stretch flex-wrap justify-center" v-if="isLoggedIn">
        <NoResults v-if="artists.length === 0" width="361px">
            <Zondicon icon="Radio" class="h-24 w-24 fill-current block ml-2" slot="icon"/>
              Start adding some artists to customize this station.
          </NoResults>
         <div class="card overflow-hidden mx-4 my-4 relative"
           v-for="artist of artists" :key="artist.identifier" :artist="artist" @click="toggle(artist)">
          <div v-if="selected(artist)">
            <Zondicon icon="checkmark-outline" class="selected"/>
          </div>
          <ArtistImage classes="rounded-full border border-grey p-1 cursor-pointer" :artist="artist"/>
          <div class="p-1">
            <div class="font-bold text-sm mb-1 text-center text-grey-darkest">{{artist.title}}</div>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer" v-if="isLoggedIn">
      <button class="rounded border border-red text-red w-24 py-2 font-bold px-3 text-sm hover:bg-red hover:text-white"
        type="button" @click="$emit('delete', station)">
        Delete
      </button>
      <button class="rounded bg-blue text-white w-24 py-2 font-bold px-3 text-sm"
        type="button" @click="save()">
        Save
      </button>
    </template>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex';
import ArtistImage from './ArtistImage';
import NoResults from './NoResults';

import Modal from './Modal';

export default {
  name: 'Recodings',
  components: {
    Modal,
    ArtistImage,
    NoResults
  },
  props: {
    station: {
      type: Object,
      default() {
        return {
          title: '',
          artists: []
        };
      }
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      index: 0,
      artists: this.station.artists || [],
      search: null
    };
  },
  computed: {
    ...mapGetters('artists', {
      query: 'search',
      total: 'total'
    })
  },
  mounted() {
  },
  methods: {
    selected(artist) {
      return this.station.artists.find((selected) => selected.identifier === artist.identifier);
    },
    onSearch() {
      clearTimeout(this.timeout);
      if (this.search.length < 3) {
        this.artists = this.station.artists;
        return;
      }
      this.timeout = setTimeout(() => {
        this.artists = this.query(this.search);
      }, 250);
    },
    save() {
      if (!this.station.title) return;
      this.$emit('save', this.station);
    },
    toggle(artist) {
      const idx = this.station.artists.findIndex((sa) => sa.identifier === artist.identifier);
      if (idx > -1) {
        this.station.artists.splice(idx, 1);
      } else {
        this.station.artists.push(artist);
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.selected {
  @apply text-green fill-current absolute h-6 w-6;
  right: 1px;
}
.title {
  @apply border;
}
img {
  height: 155px;
  width: 155px;
}
.card {
  width:155px;
}
input[disabled] {
  @apply bg-grey-lightest;
}
</style>
