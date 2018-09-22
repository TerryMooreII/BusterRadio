<template>
   <div id="artists" class="flex-grow px-24 py-2 overflow-scroll">
    <h2 class="antialiased text-grey-darkest py-6 sticky pin-t w-full bg-white">Play Queue</h2>
    
      <div v-if="queue">
        <div v-for="(track, index) in queue" 
             :key="track.file" 
             class="flex py-2 hover:bg-grey-lighter cursor-pointer items-center justify-between track-row">
          <div class="w-10 text-center">
            <span class="track-number" v-if="track.file !== currentTrack.file">{{index + 1}}</span>
            <PlayIcon class="play-icon" v-bind:cssClass="'h-4 w-4 fill-current inline-block ml-2'" v-if="track.file !== currentTrack.file"/>
            <PauseIcon class="pause-icon" v-bind:cssClass="'h-4 w-4 fill-current inline-block ml-1'" v-if="track.file === currentTrack.file && !isPlaying" />
            <img src="/img/equalizer.gif" alt="equalizer" class="h-4 w-4" v-if="track.file === currentTrack.file && isPlaying">
          </div>
          <div class="w-full">
            {{track.title}} <br>
            <span class="text-grey-dark text-sm italic">{{track.creator}} :: {{track.album}}</span>
          </div>
          <div class="w-24 text-right pr-2">
            {{track.length}}
          </div>
        </div>
       </div>
    </div>
   
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import icons from '../icons';
import Artist from '../components/Artist.vue';

export default {
  name: 'Artists',
  components: {
    Artist,
    PlayIcon: icons.Play,
    PauseIcon: icons.Pause
  },
  data() {
    return {
    
    }
  },
  computed: {
    ...mapState({
      artists: state => state.artists.all,
      queue: state => state.playlist.queue
    }),
    ...mapGetters('playlist', {
      currentTrack: 'currentTrack',
      isPlaying: 'isPlaying'
    })
  },
  methods: {
    
  },
  mounted() {
  },
  created () {
  },
  destroyed () {
  }
};
</script>

<style scoped lang="less">
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
