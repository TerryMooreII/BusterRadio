<template>
  <div class="flex" v-if="currentTrack && currentTrack.identifier">
   <ArtistImage classes="img -mt-px artist-image" :artist="artistId" />
    <div class="leading-normal ml-2 mt-3 overflow-hidden ">
      <div class="text-grey-darkest font-bold truncate">
        {{currentTrack.title}}
      </div>
      <div class="truncate">
        <router-link :to="{ name: 'years', params: { artistId: artistId.identifier }}"
            class="text-grey-dark text-sm no-underline hover:underline">
            {{currentTrack.artist}}
        </router-link>
      </div>
      <div class="truncate">
        <router-link
            :to="{ name: 'show', params: { year: currentTrack.year, artistId: artistId.identifier, showId: currentTrack.identifier }}"
            class="text-grey-dark text-sm no-underline hover:underline">
          {{currentTrack.album || currentTrack.venue}}
        </router-link>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex';
import ArtistImage from '../components/ArtistImage';

export default {
  name: 'NowPlaying',
  components: {
    ArtistImage
  },
  computed: {
    ...mapGetters('playlist', {
      currentTrack: 'currentTrack'
    }),
    ...mapGetters('artists', {
      artist: 'artist'
    }),
    artistId() {
      if (this.currentTrack) {
        const artist = this.artist(this.currentTrack.artist);
        if (artist) {
          return artist;
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
  .artist-image {
    height: 97px;
    width: 97px;
  }
</style>
