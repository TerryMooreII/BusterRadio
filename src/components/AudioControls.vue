<template>
  <div>
    <div class="flex justify-center">
        <button class="p-2">
          <Zondicon icon="Repost" class="h-5 w-5 fill-current text-grey-dark inline-block self-center mx-2 hover:text-grey-darkest cursor-pointer"/>
        </button>
        <button @click="previous()" class="p-2">
          <Zondicon icon="StepBackward" class="h-6 w-6 fill-current text-grey-dark inline-block self-center mx-2 hover:text-grey-darkest cursor-pointer"/>
        </button>

        <div class="rounded-full h-12 w-12 border-line bg-blue flex self-center mx-2 hover:bg-blue-dark cursor-pointer"
             @click="play()"
             v-if="!isPlaying">
          <Zondicon icon="Play" class="h-8 w-8 fill-current text-white inline-block play"/>
        </div>
        <div class="rounded-full h-12 w-12 border-line bg-blue flex self-center mx-2 hover:bg-blue-dark cursor-pointer"
             @click="pause()"
             v-if="isPlaying">
          <Zondicon icon="Pause" class="h-8 w-8 fill-current text-white inline-block pause"/>
        </div>

        <button @click="next()" class="p-2">
          <Zondicon icon="StepForward" class="h-6 w-6 fill-current text-grey-dark self-center mx-2 hover:text-grey-darkest cursor-pointer"/>
        </button>
        <button class="p-2">
          <Zondicon icon="Shuffle" class="h-5 w-5 fill-current text-grey-dark inline-block self-center mx-2 hover:text-grey-darkest cursor-pointer"/>
        </button>
      </div>
      <div class="flex justify-center mt-3  cursor-pointer">
        <div class="mr-4 text-xs -mt-1 text-grey-dark">{{formatTime(currentTime)}}</div>
        <div class="h-1 bg-grey-lighter w-2/3 rounded relative slider seekbar">
          <div class="rounded bg-grey h-1 slider" id="progress-buffer"></div>
          <div class="rounded bg-blue -mt-1 h-1 slider" id="progress"></div>
          <!-- <div class="rounded-full h-4 w-4 bg-grey-dark absolute dot invisible" v-bind:style="{left: percent}"></div> -->
        </div>
        <span class="ml-4 text-xs -mt-1 text-grey-dark">{{formatTime(duration)}}</span>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';


export default {
  name: 'AudioControls',
  components: {

  },
  computed: {
    ...mapState('playlist', {
      isPlaying: 'isPlaying',
      duration: 'duration',
      currentTime: 'currentTime',
      buffer: 'buffer',
      nextTrackIndex: 'nextTrackIndex'
    })
  },
  methods: {
    play() {
      this.$store.dispatch('playlist/play');
    },
    pause() {
      this.$store.dispatch('playlist/pause');
    },
    next() {
      this.$store.dispatch('playlist/next');
    },
    previous() {
      this.$store.dispatch('playlist/previous');
    },
    formatTime(time) {
      const value = parseInt(time, 10);
      let lenMins = Math.floor(value / 60);
      let lenSecs = value - lenMins * 60;
      if (Number.isNaN(lenMins)) { lenMins = 0; }
      if (Number.isNaN(lenSecs)) { lenSecs = 0; }

      return `${lenMins}:${lenSecs > 9 ? lenSecs : `0${lenSecs}`}`;
    },
    calcSeek(clicked, width) {
      return ((clicked / width * 100) / 100) * this.duration;
    },
    mousemove(e) {
      this.$store.dispatch('playlist/seek', this.calcSeek(e.offsetX, this.el.clientWidth));
      window.addEventListener('mouseup', this.mouseup, false);
    },
    mouseup() {
      this.el.removeEventListener('mousemove', this.mousemove, false);
      document.body.removeEventListener('mouseup', this.mouseup, false);
    },
    mousedown(e) {
      this.$store.dispatch('playlist/seek', this.calcSeek(e.offsetX, this.el.clientWidth));
      this.el.addEventListener('mousemove', this.mousemove, false);
    },
    updateProgress() {
      this.progressEl.style.width = this.duration === 0 ? '0%' : `${(this.currentTime / this.duration) * 100}%`;
      this.progressId = requestAnimationFrame(this.updateProgress);
    },
    updateProgressBuffer() {
      this.progressBufferEl.style.width = this.duration === 0 ? '0%' : `${(this.buffer / this.duration) * 100}%`;
      this.progressBufferId = requestAnimationFrame(this.updateProgressBuffer);
    }

  },
  mounted() {
    this.el = document.querySelector('.seekbar');
    this.el.addEventListener('mousedown', this.mousedown, false);
    this.progressEl = document.getElementById('progress');
    this.progressBufferEl = document.getElementById('progress-buffer');
    this.progressId = requestAnimationFrame(this.updateProgress);
    this.progressBufferId = requestAnimationFrame(this.updateProgressBuffer);
  },
  beforeDestroy() {
    this.el.removeEventListener('mousedown', this.mousedown, false);
    cancelAnimationFrame(this.progressId);
    cancelAnimationFrame(this.updateProgressBuffer);
  }
};
</script>

<style scoped lang="less">
  .play {
    position: relative;
    top: 8px;
    left: 10px;
  }
  .pause {
    position: relative;
    top: 8px;
    left: 8px;
  }
  .dot {
    top: -6px;
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

  .slider {
    transition: width .2s ease-in-out;
    transition-timing-function: linear;
    -webkit-transition: .2s ease-in-out;
    -webkit-transition-timing-function: linear;
  }

  button:focus {
    outline: 0 !important;
  }

</style>
