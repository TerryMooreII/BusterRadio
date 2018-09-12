<template>
  <svg :class="cssClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/></svg>
</template>

<script>
export default {
  name: 'Pause',
  props: {
    cssClass: {
      type: String,
      required: false
    }
  }
};
</script>
