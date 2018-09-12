<template>
  <svg :class="cssClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9 7H5v6h4l5 5V2L9 7z"/></svg>
</template>

<script>
export default {
  name: 'VolumeMute',
  props: {
    cssClass: {
      type: String,
      required: false
    }
  }
};
</script>
