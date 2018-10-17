<template>
  <div>
    <div class="flex flex-row" v-if="currentUser">
        <div class="-ml-1 w-8 rounded-full">
          <img :src="currentUser.photoURL" :alt="currentUser.displayName" class="w-6 h-6 rounded-full">
        </div>
        <div class="text-white text-lg">
          {{currentUser.displayName}}
        </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import icons from '../icons';  

export default {
  name: 'User',
  components:{
    Login: icons.Login,
    Logout: icons.Logout,
  },
  data() {
    return {
      currentUser: firebase.auth().currentUser
    };
  },
  methods: {
    async mounted() {
      this.currentUser = firebase.auth().currentUser;
    }
  }
};
</script>