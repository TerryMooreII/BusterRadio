<template>
  <div class="flex w-full">
    <div class="flex-grow mt-24 w-2/3" v-if="queue.length === 0">
      <div class="flex text-grey-darker leading-normal justify-around ">
        <div class="flex flex-col rounded w-2/5 p-6 pb-24">
      <NoResults v-if="queue.length === 0" width="361px">
          <Zondicon icon="MusicPlaylist" class="h-24 w-24 fill-current block ml-2" slot="icon"/>
          Your queue is empty. <br> <br>
          Go add some tracks or a <router-link to="/random-show" class="text-grey">Random Show</router-link>!
      </NoResults>
      </div>
      </div>
    </div>

    <Container v-if="queue.length > 0">
      <div class="flex text-grey-darkest px-2 md:px-0 py-6 md:sticky pin-t w-full bg-white">
        <div class="w-2/3">
          <h2>Your Queue</h2>
        </div>
        <div class="text-right w-1/3">
          <button type="button"
                  class="text-sm py-1 px-2 text-red rounded border border-red hover:text-white hover:bg-red"
                  @click="clear()">
                  Clear
          </button>
        </div>
      </div>

      <div v-if="queue.length > 0">

        <h3 class="mb-4 pb-2 border-b font-normal text-xl">Now Playing</h3>
        <div class="flex" v-if="currentTrack.sha1">
          <div class="mx-4">
            <img :src="currentTrack.image" class="h-12 w-12">
          </div>
          <div class="w-full truncate mt-2">
            <span class="text-xl md:text-base">{{currentTrack.title}}</span> <br>
            <router-link
                  class="text-grey-dark text-sm no-underline hover:underline"
                  @click.native="$event.stopImmediatePropagation()"
                  :to="{name:'years', params: {artistId: getArtistId(currentTrack.creator)}}">{{currentTrack.creator}}</router-link>
            <span  class="text-grey-dark text-sm" v-if="currentTrack.creator">&nbsp;::&nbsp;</span>
            <router-link
                    class="text-grey-dark text-sm no-underline hover:underline"
                    @click.native="$event.stopImmediatePropagation()"
                    :to="{name:'show', params: {artistId: getArtistId(currentTrack.creator), year: currentTrack.year, showId: currentTrack.identifier}}">{{currentTrack.album}}</router-link>
          </div>
          <div class="w-24 text-right pr-2 mt-2">
            {{time(currentTrack)}}
          </div>
        </div>


        <h3 class="mt-6 mb-2 pb-2 border-b  font-normal text-xl">Next Up</h3>

        <div v-for="(track, index) in filtered()"
              :key="track.file + index"
              class="flex py-2 hover:bg-grey-lighter cursor-pointer items-center justify-between track-row"
              @click="playQueueTrack(index)" :class="{'text-grey':track.hasPlayed && !track.isPlaying}">
          <div class="w-10 text-center">
            <span class="track-number" v-if="track.file !== currentTrack.file || qIdx !== index">{{index + 1}}</span>
            <Zondicon icon="Play" class="play-icon md:h-4 md:w-4 w-5 h-5 fill-current inline-block ml-2" v-if="track.file !== currentTrack.file  || qIdx !== index"/>
            <Zondicon icon="Pause" class="pause-icon md:h-4 md:w-4 w-5 h-5 fill-current inline-block ml-1" v-if="track.file === currentTrack.file && !isPlaying && qIdx === index" />
            <img src="/img/equalizer.gif" alt="equalizer" class="md:h-4 md:w-4 w-5 h-5" v-if="track.file === currentTrack.file && isPlaying && qIdx === index">
          </div>
          <div class="w-full truncate">
            <span class="text-xl md:text-base">{{track.title}}</span><br>
            <router-link
                  class="text-grey-dark text-sm no-underline hover:underline"
                  @click.native="$event.stopImmediatePropagation()"
                  :to="{name:'years', params: {artistId: getArtistId(track.creator)}}">{{track.creator}}</router-link>
            <span  class="text-grey-dark text-sm" v-if="track.creator">&nbsp;::&nbsp;</span>
            <router-link
                    class="text-grey-dark text-sm no-underline hover:underline"
                    @click.native="$event.stopImmediatePropagation()"
                    :to="{name:'show', params: {artistId: getArtistId(track.creator), year: track.year, showId: track.identifier}}">{{track.album}}</router-link>
          </div>
          <div class="w-24 text-right pr-2">
            {{time(track)}}
          </div>
        </div>
        </div>
    </Container>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

import Artist from '../components/Artist.vue';
import NoResults from '../components/NoResults';
import Container from '../components/Container';
import helpers from '../services/helpers';

export default {
  name: 'Artists',
  components: {
    Container,
    Artist,
    NoResults
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
    ]),
    getArtistId(creator) {
      if (!creator) return '';
      const artist = this.$store.getters['artists/artistByTitle'](creator);
      if (!artist) return '';
      return artist.identifier;
    },
    time(track) {
      return helpers.calcTrackTime(track);
    },
    filtered() {
      return this.queue.filter(item => !item.hasPlayed);
    }
  },
  mounted() {
    helpers.setTitle('Queue');
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
