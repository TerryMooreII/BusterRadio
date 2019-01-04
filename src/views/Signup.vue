<template>
  <div class="flex-grow mt-24 w-2/3 ">
    <div class="flex text-grey-darker leading-normal justify-around ">
      <div class="flex flex-col shadow rounded w-3/5 p-6 bg-white">
        <h2 class="mb-3 pb-2 border-b border-grey-light">
          Why Sign Up?
        </h2>
        <div>
          Sure you can use Buster Radio with out logging in but once you do login with your Google Account you will now have the access to the follow features and benefits.
          <ul class="my-4">
            <li class="py-1">
              Bookmark your favorite Artists and Shows.
            </li>
            <li class="py-2">
              Have trouble picking a show?  Play a random show from your favorites.
            </li>
            <li class="py-2">
              Move from one device to another?  We'll sync your queue across devices.
            </li>
            <li class="py-2">
              Prefer FLAC or OGG over MP3? Just update your personal settings (Coming soon)
            </li>
            <li class="py-2">
              Make and save playlists and share them with your friend (Coming soon)
            </li>
          </ul>
        </div>
        <div class="text-center m-10 mt-5" @click="login()">
          <button class="w-64 px-3 py-5 font-bold rounded text-white bg-red hover:bg-red-dark">
          Login with Google
        </button>
        </div>
        <div class="text-xs text-center">
            We know privacy is important that's why Buster Radio will NEVER sell any of your personal data or information.  And we use Google to manage your account becuase they do security better than we can :)  (More login providers are coming soon)
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import datastore from '../services/datastore';
import helpers from '../services/helpers';

export default {
  name: 'Signup',
  methods: {
    async login() {
      await datastore.login();
      this.$router.push('/');
    }
  },
  mounted() {
    helpers.setTitle('Sign Up');
    if (datastore.getCurrentUser()) {
      this.$router.push('/');
    }
  }
};
</script>
