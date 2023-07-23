<template>
  <div class="flex justify-center my-24">
    <div class="text-xl p-4 text-grey-dark flex" :style="{ width: width }">
      <div class="w-1/3 self-center">
        <slot name="icon" />
      </div>
      <div class="w-2/3 pl-8 self-center text-center">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoResults',
  props: {
    width: {
      type: String,
      default: '300px'
    }
  }
};
</script>
