<template>
   <div>
      <div v-for="(track, index) in tracks"
            :key="index"
            class="flex py-2 items-center justify-between track-row">
        <div class="w-full truncate">
          {{track.title}} <br>
          <span class="text-grey-dark text-sm italic">{{track.creator}} :: {{track.album}}</span>
        </div>
        <div class="w-6 text-right pr-2" v-if="track.md5">
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
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import icons from '../icons';
import Popover from '../components/Popover';

export default {
  name: 'RecentTracks',
  components: {
    Popover,
    DotsVertical: icons.DotsVertical
  },
  props: {
    tracks: Array
  },
  data() {
    return {
      openPopover: null
    };
  },
  methods: {
    ...mapActions('playlist', [
      'addTrackToQueue',
      'addTrackToQueuePlayNext'
    ]),
    close() {
      this.openPopover = null;
    }
  }
};
</script>
