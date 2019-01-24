<template>
   <div>
      <div v-for="(track, index) in tracks"
            :key="index"
            class="flex py-2 items-center justify-between track-row">
        <div class="w-full truncate">
          {{track.title}} <br>
          <span class="text-grey-dark text-sm">{{track.creator}} :: {{track.album}}</span>
        </div>
        <div class="w-6 text-right pr-2" v-if="track.md5">
          <button class="cursor-pointer h-4 w-4" @click.stop.prevent="openPopover = openPopover !== null ? null : index" type="button">
              <Zondicon icon="DotsHorizontalTriple" class="h-4 w-4 fill-current inline-block cursor-pointer"/>
          </button>
          <Popover :right="true" width="225px" v-if="openPopover === index" @close="close">
              <ul class="list-reset text-sm text-left popover text-grey-darkest">
                <li class="px-3 py-2 hover:bg-grey-lighter cursor-pointer flex item-center" @click.stop="addTrackToQueue(track);close()">
                   <Zondicon icon="list-add" class="h-5 w-5 fill-current mr-2" />Add to Queue
                  </li>
                <li class="px-3 py-2 hover:bg-grey-lighter cursor-pointer flex item-center" @click.stop="addTrackToQueuePlayNext(track);close()">
                   <Zondicon icon="list-add" class="h-5 w-5 fill-current mr-2" /> Add to Queue Play Next
                  </li>
              </ul>
            </Popover>
        </div>
      </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Popover from '../components/Popover';

export default {
  name: 'RecentTracks',
  components: {
    Popover
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
