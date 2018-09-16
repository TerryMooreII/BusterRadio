<template>
  <div>
    <div class="flex justify-center">
        <Replay v-bind:cssClass="'h-5 w-5 fill-current text-grey-dark inline-block self-center mr-4 hover:text-grey-darkest cursor-pointer'"/>
        <StepBack v-bind:cssClass="'h-6 w-6 fill-current text-grey-dark inline-block self-center hover:text-grey-darkest cursor-pointer'"/>
        <div class="rounded-full h-12 w-12 border-solid border-line bg-blue flex self-center mx-4 hover:bg-blue-dark cursor-pointer">
          <Play v-bind:cssClass="'h-8 w-8 fill-current text-white inline-block play'"/>
        </div>
        <StepForward v-bind:cssClass="'h-6 w-6 fill-current text-grey-dark inline-block self-center hover:text-grey-darkest cursor-pointer'"/>
        <Shuffle v-bind:cssClass="'h-5 w-5 fill-current text-grey-dark inline-block self-center ml-4 hover:text-grey-darkest cursor-pointer'"/>
      </div>
      <div class="flex justify-center mt-3  cursor-pointer">
        <div class="mr-4 text-xs -mt-1 text-grey-darker">0:00</div>
        <div class="h-1 bg-grey-lighter w-2/3 rounded relative slider">
          <div class="rounded bg-blue h-1" style="width: 12%;"></div>
          <div class="rounded-full h-4 w-4 bg-grey-dark absolute dot invisible"></div>
        </div>
        <span class="ml-4 text-xs -mt-1 text-grey-darker">16:23</span>
      </div>
  </div>
</template>

<script>
import icons from '../icons';

export default {
  name: 'AudioControls',
  components: {
    Play: icons.Play,
    StepForward: icons.StepForward,
    StepBack: icons.StepBack,
    Replay: icons.Replay,
    Shuffle: icons.Shuffle,
  },
  props: {
    msg: String,
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
  .play {
    position: relative;
    top: 8px;
    left: 10px;
  }
  .dot {
    top: -6px;
    left: 10%;
    visibility: hidden;
    opacity: 0;
    transition: hidden 0s linear 200ms, opacity 200ms;  
  }
  .slider:hover {
    .dot {
      visibility: visible;
      opacity: 1;
      transition: visibility 2000s linear 0s, opacity 200ms;
    }
  }
</style>
