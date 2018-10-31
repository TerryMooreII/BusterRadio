<template>
  <div class="flex w-full justify-center mt-2 mb-10 border-t border-b border-grey-light">
    <div class="w-22 text-right p-3  border-r border-grey-light"
         :class="{'text-grey hover:text-grey hover:no-underline cursor-default': page <= 1, 'text-blue hover:text-blue-darker hover:underline cursor-pointer': page > 1 }"
          @click="prev()">
      <ArrowLeft v-bind:cssClass="'h-3 w-3 fill-current inline-block self-center mr-1'"/>
      Prev
    </div>

    <div class="w-22 text-left p-3"
         :class="{'text-grey hover:text-grey hover:no-underline cursor-default': this.count < this.pagesize , 'text-blue hover:text-blue-darker hover:underline cursor-pointer': this.count === this.pagesize  }"
         @click="next()">
      Next
      <ArrowRight v-bind:cssClass="'h-3 w-3 fill-current inline-block self-center ml-1'"/>
    </div>
  </div>
</template>

<script>
import icons from '../icons';

export default {
  name: 'Pager',
  components: {
    ArrowLeft: icons.ArrowLeft,
    ArrowRight: icons.ArrowRight
  },
  props: {
    page: Number,
    count: Number,
    pagesize: Number
  },
  methods: {
    prev() {
      if (this.page <= 1) { return; }
      this.$emit('onPageChange', this.page - 1);
    },
    next() {
      if (this.count < this.pagesize) { return; }
      this.$emit('onPageChange', this.page + 1);
    }
  }
};
</script>

<style scoped lang="less">

</style>
