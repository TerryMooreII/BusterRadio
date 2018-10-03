<template>
  <div class="relative w-full">
    <div class="border border-solid border-grey absolute p-3 rounded z-50 shadow-lg popover bg-white" 
         v-bind:style="{left: left, width: width}">
      <slot></slot>
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
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    left() {
      if (this.right) {
        return `-${parseInt(this.width) - 30}px`
      }
      return 0
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

