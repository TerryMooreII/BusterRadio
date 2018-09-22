<template>
  <div class="flex" v-if="currentTrack">
   <ArtistImage classes="img -mt-px artist-image" :artist="artist" />
    <div class="leading-normal ml-2 mt-3 overflow-hidden ">
      <div class="text-grey-darkest antialiased font-bold truncate">
        {{currentTrack.title}}
      </div>
      <div class="truncate">
        <router-link :to="{ name: 'years', params: { artistId }}"
            class="text-grey-dark antialiased text-sm no-underline hover:underline">
            {{currentTrack.artist}}
        </router-link>
      </div>
      <div class="truncate">
        <router-link 
            :to="{ name: 'show', params: { year: currentTrack.year, artistId, showId: currentTrack.identifier }}"
            class="text-grey-dark antialiased text-sm no-underline hover:underline">
          {{currentTrack.album || currentTrack.venue}}
        </router-link>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
    artistId () {
      if (this.currentTrack && this.currentTrack.artist) {
        const artist = this.artist(this.currentTrack.artist)
        if (artist) {
          return artist.identifier;
        }
      }
      return 
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
