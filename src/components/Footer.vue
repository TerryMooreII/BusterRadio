<template>
  <footer class="w-screen border-t border-solid border-black h-24 pin-b fixed flex">
    <div class="flex-grow text-grey-darker text-center px-4 py-2">

    </div>

    <div class="flex-none pt-3 w-1/2 flex-no-shrink">
      <AudioControls />
    </div>

    <div class="flex-none text-grey-darker text-center px-4 py-2 w-240 self-center ">
      <div class="flex flex-row justify-center">
        <MusicPlaylist v-bind:cssClass="'h-5 w-5 fill-current text-grey-dark inline-block self-center mr-4 -mt-2'"/>
        <VolumeControl />
      </div>
    </div>

  </footer>
</template>

<script>
import icons from '../icons';
import AudioControls from './AudioControls';
import VolumeControl from './VolumeControl';

export default {
  name: 'Footer',
  components: {
    MusicPlaylist: icons.MusicPlaylist,
    AudioControls,
    VolumeControl,
    VolumeDown: icons.VolumeDown,
  },
  props: {
  },
  data () {
    return {
    }
  },
  methods: {

  }
};
</script>

<style scoped lang="less">

  .w-240 {
    width: 240px;
  }
</style>
