<template>
  <div>
    <div class="flex flex-row" v-if="currentUser">
        <div class="-ml-1 w-8 rounded-full">
          <img :src="currentUser.photoURL" :alt="currentUser.displayName" class="w-6 h-6 rounded-full">
        </div>
        <div class="text-lg">
          {{currentUser.displayName}}
        </div>
    </div>
  </div>
</template>

<script>
import datastore from '../services/datastore';

export default {
  name: 'User',
  data() {
    return {
      currentUser: datastore.getCurrentUser()
    };
  }
};
</script>
