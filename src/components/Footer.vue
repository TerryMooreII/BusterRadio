<template>
  <footer class="w-screen border-t border-solid border-grey-light h-24 pin-b fixed flex justify-center">
    <div class="flex-none text-grey-darker w-1/3 hidden sm:block">
      <NowPlaying />
    </div>

    <div class="flex-none pt-3 sm:w-1/3 flex-no-shrink w-full">
      <AudioControls />
    </div>

    <div class="text-grey-darker pr-20 py-2 w-full sm:w-1/3 self-center hidden sm:block">
      <div class="flex justify-end">
        <div class="w-2/5">
          <VolumeControl />
        </div>
        <button @click="queue()">
          <MusicPlaylist v-bind:cssClass="'h-5 w-5 fill-current text-grey-dark inline-block ml-6 -mt-2'"/>
        </button>
      </div>
    </div>

  </footer>
</template>

<script>
import icons from '../icons';
import AudioControls from './AudioControls';
import VolumeControl from './VolumeControl';
import NowPlaying from './NowPlaying';

export default {
  name: 'Footer',
  components: {
    MusicPlaylist: icons.MusicPlaylist,
    VolumeDown: icons.VolumeDown,
    AudioControls,
    VolumeControl,
    NowPlaying
  },
  methods: {
    queue() {
      this.$router.push('/queue');
    }
  }
};
</script>

<style scoped lang="less">

  .w-240 {
    width: 240px;
  }
   button:focus {
    outline: 0 !important;
  }
</style>
