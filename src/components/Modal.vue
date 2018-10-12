<template>
  <div class="absolute sm:w-2/3 min-h-screen modal mt-6 border border-grey-light border-solid shadow-lg rounded p-4 bg-white overflow-auto mr-2 ">
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
      default: () => { console.log('dissmiss'); }
    }
  },
  data() {
    return {
      div: null
    };
  },
  beforeMount() {
    this.div = document.createElement('div');
    this.div.style.position = 'fixed';
    this.div.style.backgroundColor = 'black';
    this.div.style.opacity = 0.3;
    this.div.style.top = 0;
    this.div.style.bottom = 0;
    this.div.style.right = 0;
    this.div.style.left = 0;

    document.body.appendChild(this.div);
  },
  beforeDestroy() {
    document.body.removeChild(this.div);
  }
};
</script>

<style scoped lang="less">
  .close {
    transform: rotate(45deg)
  }
  .modal {
    max-width: calc(100vh - 200px);
    min-height: calc(100vh - 200px);
    z-index: 100;
  }
</style>
