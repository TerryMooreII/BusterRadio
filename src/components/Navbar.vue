
<template>
  <nav class="navbar flex items-center justify-between flex-wrap bg-blue-dark px-6 py-4 fixed w-full">

    <div class="block lg:hidden">
      <button class="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-white hover:border-white"
              @click="$emit('menu')">
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
      </button>
    </div>

    <div class="flex items-center flex-no-shrink text-white -ml-8">
      <Zondicon icon="Radio" class="play-icon h-5 w-5 fill-current inline-block mr-2 -mt-1 text-grey-lighter" />
      <span class="font-semibold text-xl tracking-tight">BusterRadio</span>
    </div>
  <div @click="toggleNosleep()" v-if="isWakeLockSupported">
    <Zondicon :icon="noSleepEnabled ? 'viewShow' : 'viewHide'" class="h-5 w-5 fill-current inline-block mr-2 -mt-1 text-grey-lighter" />
  </div>
  </nav>

</template>

<script>


export default {
  name: 'navbar',
  data() {
    return {
      noSleepEnabled: false,
      isWakeLockSupported: false
    };
  },
  created() {
    this.wakeLock = null;
    this.isWakeLockSupported = 'wakeLock' in navigator;
  },
  methods: {
    async toggleNosleep() {
      if (!this.isWakeLockSupported) return;

      if (this.wakeLock == null) {
        try {
          this.wakeLock = await navigator.wakeLock.request('screen');
          this.noSleepEnabled = true;
        } catch (err) {
          console.error(err);
        }
      } else {
        await this.wakeLock.release();
        this.wakeLock = null;
        this.noSleepEnabled = false;
      }
    }
  }
};
</script>

<style scoped>
  .navbar {
    z-index: 998;
  }
</style>
