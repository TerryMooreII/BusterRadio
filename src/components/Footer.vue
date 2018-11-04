<template>
  <footer class="w-screen border-t border-grey-light h-24 md:h-24 bg-white pin-b fixed flex flex-col sm:flex-row justify-center"
           :class="{'h-48': isExpanded}">
    <div class="flex-none text-grey-darker w-full md:w-1/3 hidden md:block" :class="{'force-show': isExpanded}">
      <NowPlaying />
    </div>

    <div class="flex-none pt-3 md:w-1/3 flex-no-shrink w-full">
      <button @click="isExpanded = !isExpanded" class="fixed py-3 px-4 expander block sm:hidden">
        <Zondicons icon="ChevronDown" class="h-6 w-6 fill-current text-grey-dark inline-block hover:text-grey-darkest cursor-pointer" v-if="isExpanded"/>
        <Zondicons icon="ChevronUp" class="h-6 w-6 fill-current text-grey-dark inline-block  hover:text-grey-darkest cursor-pointer" v-if="!isExpanded"/>
      </button>
      <AudioControls />
    </div>

    <div class="text-grey-darker pr-20 py-2 w-full sm:w-1/3 self-center hidden md:block">
      <div class="flex justify-end">
        <div class="w-2/5">
          <VolumeControl />
        </div>
      </div>
    </div>

  </footer>
</template>

<script>
import AudioControls from './AudioControls';
import VolumeControl from './VolumeControl';
import NowPlaying from './NowPlaying';
import Zondicons from '../icons/Zondicons';

export default {
  name: 'Footer',
  components: {
    AudioControls,
    VolumeControl,
    NowPlaying,
    Zondicons
  },
  data() {
    return {
      isExpanded: false
    };
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
  .force-show {
    display: block !important;
  }
  .expander {
    bottom: 45px;
    left: 5px;
  }
</style>
