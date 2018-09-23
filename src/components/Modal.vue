<template>
  <div class="absolute w-2/3 min-h-screen modal mt-6 border border-grey-light border-solid shadow-lg rounded p-4 bg-white overflow-auto">
      <div class="flex mb-4 pin-t sticky bg-white pt-4">
       <slot name="header"></slot>
        <button class="ml-auto text-xl cursor-pointer h-4 w-4 -mt-2 -mr-2" @click="$emit('dismiss')">
          <span class="close inline-block">+</span>
        </button>
      </div>
      <div class="">
        <slot />
      </div>
      <div v-if="false">Footer</div>
    </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    header: String,
    dismiss: {
      type: [Function, Object],
      default: () => { console.log('dissmiss')}
    }
  },
  data () {
    return {
      
    }
  },
  methods: {

  }
};
</script>

<style scoped lang="less">
  .close {
    transform: rotate(45deg)
  }
  .modal {
    max-height: calc(100vh - 200px);
    min-height: calc(100vh - 200px);
   
  }
</style>
