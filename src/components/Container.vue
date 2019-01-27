<template>
  <div :class="css" >
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
      const shared = 'my-4 mx-0 w-full bg-white p-4 rounded shadow xl:mx-32 mr-285';
      if (this.wide) {
        return 'my-4 flex-col w-full px-0 sm:mt-0 mt-3';
      }

      return shared;
    },

    cssHeader() {
      if (this.wide) {
        return 'flex text-grey-darkest px-2 sm:px-16 py-6 sticky pin-t w-full bg-f5 z-10 block';
      }
      return '';
    }
  }
};
</script>

<style lang="less" scoped>
  .mr-285 {
    margin-right: 8rem;
  }

  @media (min-width: 1400px) {
    .mr-285 {
      margin-right: calc(285px + 8rem);
    }
  }
</style>

