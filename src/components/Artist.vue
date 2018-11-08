<template>
  <div class="card overflow-hidden mx-4 my-4 relative">
    
    <div @click="toggle()" v-if="isLoggedIn">
      <Zondicon icon="Heart" :class="clazz"/>
    </div>
      <JambaseLookup :artist="artist" class="absolute ticket"/>
    <ArtistImage classes="rounded-full border border-grey p-1 cursor-pointer" :artist="artist" @click="getYears(artist.identifier)"/>
    <div class="p-1">
      <div class="font-bold text-sm mb-1 text-center text-grey-darkest">{{artist.title}}</div>
    </div>
  </div>
</template>

<script>
import datastore from '../services/datastore';
import ArtistImage from './ArtistImage';
import JambaseLookup from './JambaseLookup';

export default {
  name: 'Artist',
  components: {
    ArtistImage,
    JambaseLookup
  },
  props: {
    artist: Object
  },
  data() {
    return {
      favorite: null
    };
  },
  computed: {
    clazz() {
      return `heart ${Boolean(this.favorite) ? 'favorite text-red-dark hover:text-red' : '' } h-6 w-6 absolute fill-current text-grey-dark mx-2 hover:text-grey-darkest cursor-pointer`;
    },
    isLoggedIn() {
      return Boolean(datastore.getCurrentUser());
    }
  },
  methods: {
    getYears(identifier) {
      this.$router.push(`/${identifier}`);
    },
    toggle() {
      if (!datastore.getCurrentUser()) {
        console.log('Need to login');
        return;
      }

      if (this.favorite) {
        this.unfavorite();
      } else {
        this.addFavorite();
      }
    },
    async isFavorite() {
      this.favorite = await datastore.isFavoriteArtist(this.artist);
    },

    async addFavorite() {
      await datastore.addFavoriteArtist(this.artist);
      await this.isFavorite();
    },
    async unfavorite() {
      await datastore.removeFavoriteArtist(this.favorite);
      await this.isFavorite();
    }
  },
  mounted() {
    this.isFavorite();
  }
};
</script>

<style scoped lang="less">
  img {
    height: 155px;
    width: 155px;
  }
  .card {
    width:155px;
  }

  .heart {
    right: -6px;
    display: none;
  }
  .heart {
    &.favorite {
      display: block !important;
    }
  }

  .ticket {
    display: none;
  }
  .card:hover {
    .heart {
      display: block;
    }
    .ticket {
      display: block;
    }
  }

</style>
