<template>
  <div class="fixed flex flex-col modal border border-grey-light shadow-lg rounded  bg-white overflow-auto">
    <div class="flex mb-6 bg-white px-6 py-4  border-b border-grey-light z-10 ">
      <slot name="header"></slot>
      <button class="ml-auto text-xl cursor-pointer h-4 w-4 -mt-2 -mr-2" @click="$emit('dismiss')">
        <span class="close inline-block">+</span>
      </button>
    </div>
    <div class="overflow-auto px-4 flex-1">
      <slot />
    </div>
    <div class="border-t flex p-4 justify-between">
      <slot name="footer"></slot>
    </div>
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
    document.body.classList.add('overflow-hidden');
    this.div = document.createElement('div');
    this.div.style.position = 'fixed';
    this.div.style.backgroundColor = 'black';
    this.div.style.opacity = 0.3;
    this.div.style.top = 0;
    this.div.style.bottom = 0;
    this.div.style.right = 0;
    this.div.style.left = 0;
    this.div.style['z-index'] = 998;

    document.body.appendChild(this.div);
  },
  beforeDestroy() {
    document.body.classList.remove('overflow-hidden');
    document.body.removeChild(this.div);
  }
};
</script>

<style scoped lang="less">
  .close {
    transform: rotate(45deg)
  }
  .modal {
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
    margin-top: 100px;
    margin: 50px 160px;
    z-index: 999;
  }

  @media (max-width: 776px) {
  .modal {
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
    margin: 20px 10px;
    z-index: 999;
  }
}
</style>
