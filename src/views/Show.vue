<template>
  <div class="flex-grow px-24 py-2 overflow-scroll width-full antialiased pt-10">
    <div class="flex flex-wrap flex-col p-4">
      <div class="flex width-full border-b border-solid border-grey bg-white sticky pin-t mb-4">
        <ArtistImage classes="mr-4 artist" :artist="artist" />
        <div class="flex flex-col w-full">
        <h1 class="font-hairline mb-1">{{artist.title}}</h1>
        <p class="leading-normal">
          <span class="italic text-grey-darkest">{{date(show.date)}}</span>
          <br>
          {{show.venue}} in
          {{show.location}}
        </p>
        <button class="rounded-full bg-blue text-white w-32 py-3 font-bold mt-3 px-5 ml-auto" type="button" @click="addTracks(show.tracks.mp3)">
          Play Show
        </button>
        </div>
      </div>
      <div v-if="show.tracks">
        <div v-for="(track, index) in show.tracks.mp3" 
             :key="track.file" 
             @click="addTrack(track)"
             class="flex py-2 hover:bg-grey-lighter cursor-pointer items-center justify-between track-row">
          <div class="w-10 text-center">
            <span class="track-number" v-if="track.file !== currentTrack.file">{{index + 1}}</span>
            <PlayIcon class="play-icon" v-bind:cssClass="'h-4 w-4 fill-current inline-block ml-2'" v-if="track.file !== currentTrack.file"/>
            <PauseIcon class="pause-icon" v-bind:cssClass="'h-4 w-4 fill-current inline-block ml-1'" v-if="track.file === currentTrack.file && !isPlaying" />
            <img src="/img/equalizer.gif" alt="equalizer" class="h-4 w-4" v-if="track.file === currentTrack.file && isPlaying">
          </div>
          <div class="w-full">
            {{track.title}} 
          </div>
          <div class="w-24 text-right pr-2">
            {{track.length}}
          </div>
        </div>
       </div>
      </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex'
import icons from '../icons';
import ArchiveApi from '../api/archive';
import ArtistImage from '../components/ArtistImage';

export default {
  name: 'show',
  components: {
    PlayIcon: icons.Play,
    PauseIcon: icons.Pause,
    ArtistImage
  },
  computed: {
    ...mapGetters('playlist', {
      currentTrack: 'currentTrack',
      isPlaying: 'isPlaying'
    })
  },
  data() {
    return {
      show: {},
      artist: {}
    }
  },
  methods: {
    getShowsByDate(date) { //This is for a list of other sources for this show
      ArchiveApi.getShowsByDate(this.artist.identifier, date).then(data => console.log(data));
    },
    date(date) {
      return moment(date).format('LL');
    },
    ...mapActions('playlist', [
      'addTrack',
      'addTracks'
    ])
  },
  mounted() {
    ArchiveApi.getShow(this.$route.params.showId,).then(data => this.show = data);
    this.artist = this.$store.getters['artists/artist'](this.$route.params.artistId);
  }
};
</script>

<style lang="less" scoped>
  img.artist { 
    height: 150px;
    width: 150px;
    background: white;
  }
  .play-icon{
    display: none;
  }
  .track-row:hover {
    & > div > .play-icon {
      display: block;
    }
    & > div >  .track-number {
      display: none;
    }
  }
</style>
