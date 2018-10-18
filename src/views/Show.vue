<template>
  <div class="flex-grow px-0 sm:px-10 lg:px-32 sxl:px-64 py-2 overflow-scroll width-full antialiased pt-10">
    <div class="flex flex-wrap flex-col p-4 px-2 sm:px-0">
      <div class="flex flex-col sm:flex-row width-full bg-white sticky pin-t pt-8 sm:pt-0 mb-4 pb-4 text-center sm:text-left">
        <ArtistImage classes="mr-0 sm:mr-4 artist self-center hidden sm:block" :artist="artist" />
        <div class="flex flex-col w-full">
          <h1 class="font-hairline mb-1">
            <router-link :to="{name: 'years', params: {artistId: artist.identifier} }" class="no-underline hover:underline text-black">
              {{artist.title}}
            </router-link>
          </h1>
          <p class="leading-normal">
            <span class="italic text-grey-darkest">{{show.date | dateformat}}</span>
            <br>
            {{show.venue}} in
            {{show.location}}
          </p>
          <Stars cssClass="h-4 w-4" v-if="show.reviews" :rank="show.reviews.info.avg_rating" />
          <button class="rounded bg-blue text-white w-100 py-3 font-bold mt-3 px-5 ml-auto mb-3 sm:mb-0" type="button" @click="addTracks(show.tracks.mp3)">
            Play Show
          </button>
        </div>
      </div>
      <h2 v-if="show.tracks && !show.tracks[trackFileType].length" class="flex justify-center pt-8 text-grey-darkest italic">
        No {{trackFileType}} tracks for this show.
      </h2>
      <Loading v-if="!show.tracks" />
      <div v-if="show.tracks && show.tracks[trackFileType].length">
        <div v-for="(track, index) in show.tracks[trackFileType]"
             :key="track.file"
             @click="addTrack(track)"
             class="flex py-2 hover:bg-grey-lighter cursor-pointer items-center justify-between track-row">
          <div class="w-10 text-center">
            <span class="track-number" v-if="track.file !== currentTrack.file">{{index + 1}}</span>
            <PlayIcon class="play-icon" v-bind:cssClass="'h-4 w-4 fill-current inline-block ml-2'" v-if="track.file !== currentTrack.file"/>
            <PauseIcon class="pause-icon" v-bind:cssClass="'h-4 w-4 fill-current inline-block ml-1'" v-if="track.file === currentTrack.file && !isPlaying" />
            <img src="/img/equalizer.gif" alt="equalizer" class="h-4 w-4" v-if="track.file === currentTrack.file && isPlaying">
          </div>
          <div class="w-full truncate pl-4">
            {{track.title}}
          </div>
          <div class="w-24 text-right pr-2">
            {{time(track)}}
          </div>
          <div class="w-16 text-center">
             <button class="cursor-pointer h-4 w-4" @click.stop.prevent="openPopover = openPopover !== null ? null : index" type="button">
              <DotsVertical v-bind:cssClass="'h-4 w-4 fill-current inline-block cursor-pointer'"/>
            </button>
            <Popover :right="true" width="195px" v-if="openPopover === index" @close="close">
              <ul class="list-reset text-sm text-left popover">
                <li class="py-2 px-2 hover:bg-grey-light rounded" @click.stop="addTrackToQueue(track);close()">Add to Queue</li>
                <li class="py-2 px-2 rounded hover:bg-grey-light" @click.stop="addTrackToQueuePlayNext(track);close()">Add to Queue Play Next</li>
              </ul>
            </Popover>
          </div>
        </div>
       </div>

      <Accordian class="mt-10" v-if="show.lineage || show.source">
        <span slot="header">Lineage &amp; Source</span>
        <p class="my-2 text-xs leading-normal">
          {{show.lineage}}<br><br>
          {{show.source}}
        </p>
      </Accordian>
      <Accordian v-if="show.reviews">
        <span slot="header">Reviews</span>
        <Reviews :reviews="show.reviews.reviews" />
      </Accordian>

      <Accordian v-if="show.description">
        <span slot="header">More Info</span>
        <p class="my-2 text-xs leading-normal">
           {{sanitize(show.description)}}
        </p>
      </Accordian>
      </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import icons from '../icons';
import ArchiveApi from '../api/archive';
import ArtistImage from '../components/ArtistImage';
import Loading from '../components/Loading';
import Popover from '../components/Popover';
import Stars from '../components/Stars';
import Reviews from '../components/Reviews';
import Accordian from '../components/Accordian';

const TRACK_FILE_TYPE = {
  MP3: 'mp3',
  FLAC: 'flac',
  OGG: 'ogg'
};

export default {
  name: 'show',
  components: {
    PlayIcon: icons.Play,
    PauseIcon: icons.Pause,
    ListAdd: icons.ListAdd,
    DotsVertical: icons.DotsVertical,
    ArtistImage,
    Loading,
    Popover,
    Stars,
    Reviews,
    Accordian
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
      artist: {},
      trackFileType: TRACK_FILE_TYPE.MP3,
      openPopover: null
    };
  },
  methods: {
    ...mapActions('playlist', [
      'addTrack',
      'addTracks',
      'addTrackToQueue',
      'addTrackToQueuePlayNext'
    ]),
    close() {
      this.openPopover = null;
    },
    time(track) {
      if (!track && !track.length) {
        return '0:00';
      } else if (track.length.includes('.')) {
        const t = track.length / 3600;
        const h = Math.floor(t);
        const m = Math.floor((t - h) * 60);
        const s = Math.floor(((t - h) * 60 - m) * 60);
        const pad = unit => (String(unit).length === 2 ? unit : `0${unit}`);
        return `${pad(m)}:${pad(s)}`;
      }
      return track.length;
    },
    sanitize(val) {
      const div = document.createElement('div');
      div.innerHTML = val;
      const text = div.textContent || div.innerText || '';
      return text;
    }
  },
  mounted() {
    const supportedFileTypes = Object.values(TRACK_FILE_TYPE);
    const search = this.$route.query.type;
    if (search && supportedFileTypes.some(val => search.toLowerCase() === val)) {
      this.trackFileType = TRACK_FILE_TYPE[search.toUpperCase()];
    }
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
    .play-icon {
      display: block;
    }
    .track-number {
      display: none;
    }
  }
</style>
