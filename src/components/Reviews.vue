<template>
  <div>
    <div class="flex flex-col pb-5 w-full text-sm" v-for="review of reviews" :key="review.date">
      <div class="flex flex-row">
        <div class="font-semibold leading-normal">{{review.reviewtitle}}</div>
        <div class="ml-auto">
          <Stars cssClass="h-3 w-3" :rank="review.stars" />
        </div>
      </div>
      <div class="text-xs leading-normal">
        {{review.reviewbody}}
      </div>
      <div class="leading-normal">
        <span class="text-grey-dark">{{review.reviewer}} on {{review.reviewdate | dateformat}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Stars from './Stars';

export default {
  name: 'Reviews',
  components: {
    Stars
  },
  props: {
    reviews: Array
  }
};
</script>
