<template>
  <div class="bg-white overflow-hidden">
    <h2 class="text-sm pb-2 mb-3 border-grey-light border-solid border-b mt-6 hover:underline cursor-pointer font-normal" @click="open = !open">
      <slot name="header"></slot>
    </h2>
    <div :class="{ 'h-0': !open }">
      <slot />
    </div>

  </div>
</template>

<script>
export default {
  name: 'Accordian',
  data() {
    return {
      open: false
    };
  }
};
</script>

