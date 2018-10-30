<template>
  <div :class="css">
     <span :class="cssHeader">
        <slot name="header" />
      </span>

      <slot />
  </div>
</template>

<script>
export default {
  name: 'List',
  props: {
    wide: Boolean
  },
  computed: {
    css() {
      const shared = 'my-4 mx-0 sm:mx-10 lg:mx-32 sxl:px-64 w-2/3 antialiased bg-white p-4 rounded shadow'
      if (this.wide){
        return `flex-col w-full px-0 sm:px-24 sm:mt-0 mt-3`
      }

      return shared;
    },

    cssHeader() {
      if (this.wide) {
        return 'flex antialiased text-grey-darkest px-2 sm:px-16 py-6 sticky pin-t w-full bg-f5 z-10 block';
      }
      return '';
    }
  }
};
</script>
