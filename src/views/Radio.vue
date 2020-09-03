<template>
  <Container :wide="true">
    <template slot="header">
      <div class="w-full">
        <h2>Radio</h2>
      </div>
    </template>
    <div class="flex items-stretch flex-wrap justify-center">
      <div class="station overflow-hidden m-4 relative shadow bg-white rounded hover:bg-grey-lightest cursor-pointer"
        @click="openStationAddModal()">
        <div class="flex flex-col items-center justify-center h-full">
          <Zondicon icon="add-outline" class="h-16 w-16 text-grey fill-current pb-2"/>
          Add Station
        </div>
      </div>
      <div v-for="station in stations"
        :key="station.key"
        class="station overflow-hidden m-4 relative shadow bg-white rounded hover:bg-grey-lightest cursor-pointer">
        <div class="flex flex-col h-full items-center justify-around">
          <div class="flex flex-wrap p-4 station h-full" @click="playRadioStation(station)" v-if="station.artists">
            <div v-if="isLoading !== station.key">
              <div class="play-station-icon" :class="{'block': isLoading === station.key}">
                <Zondicon icon="Play" class="h-16 w-16 text-grey-darkest fill-current " v-if="isLoading !== station.key" />
              </div>
              <ArtistImage :artist="artist" class="station-image p-1"  v-for="artist in station.artists.slice(0,4)" :key="artist.identifier"/>
            </div>
            <Loading v-if="isLoading === station.key" />
          </div>
          <div class="flex w-full p-4 justify-between items-center">
            {{station.title}}
            <button type="button" @click="openStationAddModal(station)" v-if="station.key !== 'all' && station.key !== 'favorites'">
              <Zondicon icon="navigation-more" class="h-6 w-6 text-grey hover:text-grey-darkest fill-current"/>
            </button>
          </div>
        </div>
      </div>
    </div>
    <RadioStationModal v-if="showModal"
      :station="station"
      :isLoggedIn="isLoggedIn"
      @dismiss="showModal = false"
      @save="saveStation"
      @delete="deleteStation"/>
  </Container>
</template>

<script>
import { mapActions } from 'vuex';
import datastore from '../services/datastore';
import ArchiveApi from '../api/archive';
import Loading from '../components/Loading';
import Container from '../components/Container';
import RadioStationModal from '../components/RadioStationModal';
import ArtistImage from '../components/ArtistImage';
import helpers from '../services/helpers';

export default {
  name: 'Radio',
  components: {
    Container,
    Loading,
    RadioStationModal,
    ArtistImage
  },
  computed: {
    isLoggedIn() {
      return Boolean(datastore.getCurrentUser());
    }
  },
  data() {
    return {
      stations: [],
      station: null,
      showModal: false,
      isLoading: null
    };
  },
  methods: {
    ...mapActions('playlist', [
      'addTracks',
      'clear',
      'play',
      'pause'
    ]),
    async saveStation(station) {
      this.showModal = false;
      await datastore.saveStation(station);
      this.stations = await this.getStations();
    },
    async deleteStation(station) {
      this.showModal = false;
      await datastore.removeStation(station.key);
      this.stations = await this.getStations();
    },
    openStationAddModal(station) {
      this.station = station;
      this.showModal = true;
    },
    async playRadioStation(station) {
      const { artists, key } = station;
      this.isLoading = key;
      const promises = new Array(50).fill('').map(async () => this.getRandomTrack(artists));
      Promise.all(promises).then((tracks) => {
        this.addTracks(tracks.flat());
        this.$router.push('/queue');
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        this.isLoading = null;
      });
    },
    getTrack(tracks, array = [], index = Math.floor(Math.random() * tracks.length)) {
      const track = tracks[index];

      if (track.title.trim().endsWith('>')) {
        array.push(track);
        if (index + 1 < tracks.length) {
          return this.getTrack(tracks, array, index + 1);
        }
      }

      if (array.length) {
        array.push(track);
      } else if (['banter', 'talk', 'tuning', 'intro', 'crowd', 'crowd/tuning'].includes(track.title.toLowerCase())) {
        return this.getTrack(tracks);
      }

      return array.length ? array : track;
    },
    async getRandomTrack(artists) {
      const artistId = artists[Math.floor(Math.random() * artists.length)].identifier;

      try {
        const shows = await ArchiveApi.getShows(artistId);
        if (!shows) return await this.getRandomTrack(artists);

        const keys = Object.keys(shows);
        const id = keys[Math.floor(Math.random() * keys.length)];

        const { identifier, year } = shows[id];
        if (!identifier || !year) return await this.getRandomTrack();

        const show = await ArchiveApi.getShow(identifier);
        // if (!show || !show.tracks || !Array.isArray(show.tracks.mp3) || show.tracks.mp3.length) return await this.getRandomTrack();
        const track = this.getTrack(show.tracks.mp3);
        if (!track) return this.getRandomTrack(artists);
        return track;
      } catch (error) {
        return this.getRandomTrack(artists);
      }
    },
    async getStations() {
      if (!this.isLoggedIn) {
        this.stations.push({
          key: 'all',
          title: 'All Artists',
          artists: this.$store.getters['artists/all']
        });
        return;
      }
      const firebaseArtists = await datastore.getFavoriteArtists();
      const favs = Object.keys(firebaseArtists).map((k) => firebaseArtists[k]);
      this.stations = await datastore.getStations() || [];
      if (favs.length) {
        this.stations.push({
          key: 'favorites',
          title: 'Favorite Artists',
          artists: favs
        });
      }
      this.stations.push({
        key: 'all',
        title: 'All Artists',
        artists: this.$store.getters['artists/all']
      });
    }
  },
  async mounted() {
    helpers.setTitle('Radio');
    this.getStations();
  }
};
</script>

<style lang="postcss" scoped>
  .play-station-icon svg {
    top: 75px;
    left: 85px;
    @apply absolute;
  }
  .station:hover .play-station-icon {
    @apply absolute block;
    top:0;
    left: 0;
    right: 0;
    bottom: 40px;
    background-color: rgba(255,255,255,.8)
  }
  .play-station-icon {
    @apply hidden;
  }
  .station-image {
    height: 50% !important;
    @apply w-1/2  !important;
  }
  .station {
    width: 220px;
    height:220px;
  }
  .h-50 {
    height: 50px;
  }
</style>
