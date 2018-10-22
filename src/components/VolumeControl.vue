<template>
   <div class="flex justify-end">
    <div v-if="!isMuted" @click="mute()" class="-mt-px">
      <VolumeMute v-bind:cssClass="'h-5 w-5 fill-current text-grey-dark inline-block self-center mr-1 -mt-2'"
        v-if="level < 40"/>
      <VolumeDown v-bind:cssClass="'h-5 w-5 fill-current text-grey-dark inline-block self-center mr-1 -mt-2'"
        v-if="level >= 40 && level < 70"/>
      <VolumeUp v-bind:cssClass="'h-5 w-5 fill-current text-grey-dark inline-block self-center mr-1 -mt-2'"
        v-if="level >= 70"/>
    </div>
    <div v-if="isMuted" @click="unmute()" class="-mt-px">
      <VolumeOff v-bind:cssClass="'h-5 w-5 fill-current text-grey-dark inline-block self-center mr-1 -mt-2'" />
    </div>
    <div class="h-1 bg-grey-light w-1/2 rounded relative volumebar">
      <div class="rounded bg-blue h-1" v-bind:style="{width: levelPercent}"></div>
    </div>
   </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import icons from '../icons';

export default {
  name: 'VolumeControl',
  components: {
    VolumeDown: icons.VolumeDown,
    VolumeUp: icons.VolumeUp,
    VolumeMute: icons.VolumeMute,
    VolumeOff: icons.VolumeOff
  },
  data() {
    return {
      percent: '0%',
      el: null
    };
  },
  computed: {
    level() {
      return this.$store.state.volume.level * 100 || 0;
    },
    levelPercent() {
      return `${this.level}%`;
    },
    isMuted() {
      return this.$store.state.volume.isMuted;
    }
  },
  methods: {
    ...mapActions('volume', [
      'mute',
      'unmute'
    ]),
    mousemove(e) {
      this.$store.dispatch('volume/setLevel', e.offsetX / this.el.clientWidth);
      window.addEventListener('mouseup', this.mouseup, false);
    },
    mouseup() {
      this.el.removeEventListener('mousemove', this.mousemove, false);
      window.removeEventListener('mouseup', this.mouseup, false);
    },
    mousedown(e) {
      this.$store.dispatch('volume/setLevel', e.offsetX / this.el.clientWidth);
      this.el.addEventListener('mousemove', this.mousemove, false);
    }

  },
  mounted() {
    this.el = document.querySelector('.volumebar');
    this.el.addEventListener('mousedown', this.mousedown, false);
  },
  beforeDestroy() {
    this.el.removeEventListener('mousedown', this.mousedown, false);
  }
};
</script>

<style scoped lang="less">
  .volumebar {
    transition: width .2s ease-in-out;
    transition-timing-function: linear;
    -webkit-transition: .2s ease-in-out;
    -webkit-transition-timing-function: linear;
  }
</style>
