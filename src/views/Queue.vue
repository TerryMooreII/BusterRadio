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

    <NoResults v-if="queue.length === 0" width="361px">
        <MusicPlaylist v-bind:cssClass="'h-24 w-24 fill-current block ml-2'" slot="icon"/>
        Your queue is empty. <br> <br>
        Go add some tracks or a <router-link to="/random-show" class="text-grey">Random Show</router-link>!
    </NoResults>


    <div v-if="queue">
      <div v-for="(track, index) in queue"
            :key="track.file + index"
            class="flex py-2 hover:bg-grey-lighter cursor-pointer items-center justify-between track-row"
            @click="playQueueTrack(index)">
        <div class="w-10 text-center">
          <span class="track-number" v-if="track.file !== currentTrack.file || qIdx !== index">{{index + 1}}</span>
          <PlayIcon class="play-icon" v-bind:cssClass="'h-4 w-4 fill-current inline-block ml-2'" v-if="track.file !== currentTrack.file  || qIdx !== index"/>
          <PauseIcon class="pause-icon" v-bind:cssClass="'h-4 w-4 fill-current inline-block ml-1'" v-if="track.file === currentTrack.file && !isPlaying && qIdx === index" />
          <img src="/img/equalizer.gif" alt="equalizer" class="h-4 w-4" v-if="track.file === currentTrack.file && isPlaying && qIdx === index">
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
import NoResults from '../components/NoResults';

export default {
  name: 'Artists',
  components: {
    Artist,
    NoResults,
    PlayIcon: icons.Play,
    PauseIcon: icons.Pause,
    MusicPlaylist: icons.MusicPlaylist
  },
  computed: {
    ...mapState({
      artists: state => state.artists.all,
      queue: state => state.playlist.queue,
      qIdx: state => state.playlist.qIdx
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
