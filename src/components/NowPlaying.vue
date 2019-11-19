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
import mediaSession from '../services/mediaSession';

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
      artistByTitle: 'artistByTitle'
    }),
    artistId() {
      if (this.currentTrack) {
        const artist = this.artistByTitle(this.currentTrack.artist);
        if (artist) {
          return artist;
        }
      }
      return {};
    }
  },
  watch: {
    currentTrack: function(val) {
      this.setMediaSessionData(val);
    }
  },
  methods:{
    setMediaSessionData(val){
      if (!val && val.identifier) return; 

      mediaSession.setMetaData({
        artist: val.artist,
        album: val.album || val.venue,
        title: val.title,
        image: val.artist ? `https://archive.org/services/img/${this.artistByTitle(this.currentTrack.artist).identifier}` : ''
      });
    }
  },
  mounted(){
    this.setMediaSessionData(this.currentTrack);
  }
};
</script>

<style scoped lang="less">
  .artist-image {
    height: 97px;
    width: 97px;
  }
</style>
