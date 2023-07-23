<template>
  <div class="relative w-full">
    <div
      class="border border-grey absolute py-2 rounded z-50 shadow-md popover bg-white"
      v-bind:style="{ left: leftComputed, width: width }">
      <slot />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Popover',
  components: {
  },
  props: {
    right: Boolean,
    width: {
      type: String,
      default: '100px'
    },
    left: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      show: false
    };
  },
  computed: {
    leftComputed() {
      if (this.right) {
        return this.left || `-${parseInt(this.width, 10) - 30}px`;
      }
      return 0;
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  },
  mounted() {
    window.addEventListener('click', this.close, false);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.close, false);
  }
};
</script>
