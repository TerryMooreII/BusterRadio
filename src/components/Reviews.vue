<template>
  <div> 
    <div class="flex flex-row" v-for="review of reviews" :key="review.date">
      <div class="flex flex-col text-sm pb-5 w-full">
        <div class="flex flex-col">
          <div class="flex flex-row">
            <div class="font-semibold text-sm leading-normal">{{review.reviewtitle}}</div>
            <div class="ml-auto">
              <Stars cssClass="h-3 w-3" :rank="review.stars" />
            </div>
          </div>
          <div>
            <div class="text-xs antialiased leading-normal">
              {{review.reviewbody}}
            </div>
            <div class="justify-left leading-normal text-xs">
              <span class="text-grey-dark">{{review.reviewer}} on {{review.reviewdate | dateformat}}</span> 
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Stars from '../components/Stars';
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

