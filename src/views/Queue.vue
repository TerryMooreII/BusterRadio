<template>
   <div id="artists" class="flex-grow px-0 sm:px-24 py-2 overflow-scroll">
     <div class="flex antialiased text-grey-darkest px-2 sm:px-0 py-6 sticky pin-t w-full bg-white">
      <div class="w-2/3">
        <h2>Play Queue</h2>
      </div>
      <div class="text-right w-1/3">
        <button type="button"
                class="text-sm py-1 px-2 text-red rounded border border-solid border-red hover:text-white hover:bg-red"
                @click="clear()">
                Clear
        </button>
      </div>
    </div>

      <div v-if="queue">
        <div v-for="(track, index) in queue"
             :key="track.file"
             class="flex py-2 hover:bg-grey-lighter cursor-pointer items-center justify-between track-row"
             @click="playQueueTrack(index)">
          <div class="w-10 text-center">
            <span class="track-number" v-if="track.file !== currentTrack.file">{{index + 1}}</span>
            <PlayIcon class="play-icon" v-bind:cssClass="'h-4 w-4 fill-current inline-block ml-2'" v-if="track.file !== currentTrack.file"/>
            <PauseIcon class="pause-icon" v-bind:cssClass="'h-4 w-4 fill-current inline-block ml-1'" v-if="track.file === currentTrack.file && !isPlaying" />
            <img src="/img/equalizer.gif" alt="equalizer" class="h-4 w-4" v-if="track.file === currentTrack.file && isPlaying">
          </div>
          <div class="w-full truncate">
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
import { mapGetters, mapActions, mapState } from 'vuex';
import icons from '../icons';
import Artist from '../components/Artist.vue';

export default {
  name: 'Artists',
  components: {
    Artist,
    PlayIcon: icons.Play,
    PauseIcon: icons.Pause
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
    ...mapActions('playlist', [
      'playQueueTrack',
      'clear'
    ])
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
  button{
    transition: background-color 0.5s ease;

  }
</style>