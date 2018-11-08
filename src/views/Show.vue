<template>
  <Container id="show">
    <div v-if="show">
      <div class="flex flex-col sm:flex-row width-full bg-white sticky pin-t pt-3 sm:pt-0 mb-4 pb-3 text-left border-b border-grey">
        
        <ArtistImage classes="mr-0 sm:mr-4 artist self-center hidden sm:block" :artist="artist" v-if="!hasShowImage"/>
        <img class="mr-0 sm:mr-4 artist self-center hidden sm:block" v-bind:src="show.image" v-bind:alt="show.image" v-if="hasShowImage">
        <div class="flex flex-row w-full self-center justify-between">
          <div class="flex flex-col self-center">
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
          </div>
          <div class="flex flex-col text-right self-center">
            <div>
              <FavoriteShow :show="show" v-if="show"/>
              <JambaseLookup :artist="artist" class="ml-4"/>

              <button class="cursor-pointer h-5 w-5 ml-3" @click.stop.prevent="openShowPopover = !openShowPopover" type="button">
                <Zondicons icon="DotsVertical" class="h-5 w-5 fill-current inline-block cursor-pointer"/>
              </button>
              <Popover :right="true" width="195px" left="-95px" v-if="openShowPopover" @close="close">
                <ul class="list-reset text-sm text-left popover">
                  <!-- <li class="py-2 px-2 rounded hover:bg-grey-light cursor-pointer" @click.stop="addTrackToQueuePlayNext(track);close()">Add Show to Queue</li> -->
                  <li class="px-3 py-2 hover:bg-grey-lighter cursor-pointer" @click.stop="openOnArchive();close()">View On Archive.org</li>
                </ul>
              </Popover>

            </div>
            <Stars cssClass="h-4 w-4 mt-2" v-if="show.reviews" :rank="show.reviews.info.avg_rating" />
           
           <div>
              <button class="cursor-pointer text-sm text-grey-darker flex self-center ml-auto" @click.stop.prevent="openDownloadPopover = !openDownloadPopover" type="button">
                <span class="inline-block mr-1 -pt-1">{{show.downloads || 0}}</span>
              <Zondicons icon="Download" class="h-4 w-4 fill-current inline-block"/>
            </button>
            <Popover :right="true" width="195px" left="-95px" v-if="openDownloadPopover" @close="close">
              <ul class="list-reset text-sm text-left popover">
                <li class="pt-1 pb-1 mb-1 border-b border-grey text-center uppercase text-xs">Download Show</li>
                <li class="px-3 py-2 hover:bg-grey-lighter cursor-pointer" v-if="show.tracks.mp3" @click.stop="downloadShow('mp3');close()">as MP3</li>
                <li class="px-3 py-2 hover:bg-grey-lighter cursor-pointer" v-if="show.tracks.flac" @click.stop="downloadShow('flac');close()">as FLAC</li>
                <li class="px-3 py-2 hover:bg-grey-lighter cursor-pointer" v-if="show.tracks.ogg" @click.stop="downloadShow('ogg');close()">as OGG</li>
              </ul>
            </Popover>
           </div>
            
            <button class="rounded bg-blue text-white w-24 sm:w-32 py-2 sm:py-3 font-bold mt-3 px-3 text-sm sm:text-base sm:px-4 ml-auto mb-3 sm:mb-0"
                    type="button"
                    @click="addTracks(show.tracks.mp3)">
              Play Show
            </button>
          </div>
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
            <Zondicons icon="Play" class="play-icon h-4 w-4 fill-current inline-block ml-2" v-if="track.file !== currentTrack.file"/>
            <Zondicons icon="Pause" class="pause-icon h-4 w-4 fill-current inline-block ml-1" v-if="track.file === currentTrack.file && !isPlaying" />
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
              <Zondicons icon="DotsVertical" class="h-4 w-4 fill-current inline-block cursor-pointer"/>
            </button>
            <Popover :right="true" width="195px" v-if="openPopover === index" @close="close">
              <ul class="list-reset text-sm text-left popover">
                <li class="px-3 py-2 hover:bg-grey-lighter" @click.stop="addTrackToQueue(track);close()">Add to Queue</li>
                <li class="px-3 py-2 hover:bg-grey-lighter" @click.stop="addTrackToQueuePlayNext(track);close()">Add to Queue Play Next</li>
              </ul>
            </Popover>
          </div>
        </div>
       </div>


      <Accordian v-if="show.description">
        <span slot="header">More Info</span>
        <p class="my-2 text-xs leading-normal" v-html="show.description"></p>
      </Accordian>

       <Accordian v-if="show.date" @onToggle="onAlternateRecordingsOpen">
        <span slot="header">Alternate Recordings</span>
        <Recordings :artist="artist" :date="show.date" :filter="$route.params.showId" v-if="fetchAlternateRecordings"/>
      </Accordian>

      <Accordian v-if="show.reviews">
        <span slot="header">Reviews</span>
        <Reviews :reviews="show.reviews.reviews" />
      </Accordian>

      <Accordian v-if="show.lineage || show.source">
        <span slot="header">Lineage &amp; Source</span>
        <p class="my-2 text-xs leading-normal">
          <strong>Taper:</strong> {{show.taper || 'unknown'}}<br>
          <strong>Source:</strong> {{show.source}}<br>
          <strong>Lineage:</strong> {{show.lineage}}<br>
          
        </p>
      </Accordian>

    </div>
  </Container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Zondicons from '../icons/Zondicons';
import ArchiveApi from '../api/archive';
import ArtistImage from '../components/ArtistImage';
import Loading from '../components/Loading';
import Popover from '../components/Popover';
import Stars from '../components/Stars';
import Reviews from '../components/Reviews';
import Accordian from '../components/Accordian';
import Recordings from '../components/Recordings';
import FavoriteShow from '../components/FavoriteShow';
import Container from '../components/Container';
import JambaseLookup from '../components/JambaseLookup';
import helpers from '../services/helpers';

const TRACK_FILE_TYPE = {
  MP3: 'mp3',
  FLAC: 'flac',
  OGG: 'ogg'
};

export default {
  name: 'ShowComp',
  components: {
    Container,
    Zondicons,
    FavoriteShow,
    ArtistImage,
    Loading,
    Popover,
    Stars,
    Reviews,
    Accordian,
    Recordings,
    JambaseLookup
  },
  computed: {
    ...mapGetters('playlist', {
      currentTrack: 'currentTrack',
      isPlaying: 'isPlaying'
    }),
    hasShowImage() {
      return this.show.image.includes('http') && !this.show.image.includes('__ia_thumb');
    }
  },
  watch: {
    '$route.params.showId': function () {
      this.fetchAlternateRecordings = false;
      this.getShow();
    }
  },
  data() {
    return {
      show: null,
      artist: {},
      trackFileType: TRACK_FILE_TYPE.MP3,
      openPopover: null,
      openShowPopover: null,
      openDownloadPopover: null,
      fetchAlternateRecordings: false
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
      this.openShowPopover = null;
      this.openDownloadPopover = null;
    },
    onAlternateRecordingsOpen(isOpen) {
      if (isOpen && !this.fetchAlternateRecordings) {
        this.fetchAlternateRecordings = true;
      }
    },
    time(track) {
      return helpers.calcTrackTime(track);
    },
    sanitize(val) {
      const div = document.createElement('div');
      div.innerHTML = val;
      const text = div.textContent || div.innerText || '';
      return text;
    },
    getShow() {
      ArchiveApi.getShow(this.$route.params.showId).then((data) => {
        this.show = data;
        document.querySelector('#show').scrollTo(0, 0);
      });
    },
    downloadShow(format) {
      window.open(ArchiveApi.downloadShowUrl(this.show.identifier, format), '_blank');
    },
    openOnArchive() {
      window.open(ArchiveApi.getArchiveUrl(this.show.identifier), '_blank');
    }
  },
  mounted() {
    const supportedFileTypes = Object.values(TRACK_FILE_TYPE);
    const search = this.$route.query.type;
    if (search && supportedFileTypes.some(val => search.toLowerCase() === val)) {
      this.trackFileType = TRACK_FILE_TYPE[search.toUpperCase()];
    }
    this.getShow();
    this.artist = this.$store.getters['artists/artistByIdentifier'](this.$route.params.artistId);
  }
};
</script>

<style lang="less" scoped>
  img.artist {
    height: 150px;
    width: 150px;
    background: white;
  }
</style>

<style lang="less">
.play-icon {
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
