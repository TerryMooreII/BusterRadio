<template>
  <div class="text-grey-darker px-8 pb-16 w-240 pt-4 bg-blue-dark sm:visible sidenav overflow-scroll fixed sm:min-h-screen text-white"
       :class="{'visible': show === true, 'invisible': show === false}">
    <div class="flex items-center flex-no-shrink tracking-wide ">
      <svg class="fill-current h-8 w-8 mr-2 hidden sm:block" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/>
      </svg>
      <!-- <img src="/img/pig-lg-grey.png" alt="logo" class="h-8 w-12"> -->
      <span class="font-semibold text-xl tracking-tight tracking-normal hidden sm:block">BusterRadio</span>
    </div>

    <ul class="list-reset mt-6 border-t border-grey pt-4">
      <li class="" v-for="item of links" :key="item.name">
        <router-link :to="{name: item.link}" v-if="(!item.hideLoggedIn || !isLoggedIn)"
                     class=" block py-2 text-grey-lightest hover:text-grey-light no-underline cursor-pointer text-base">
          <div @click="close()">
            <Zondicon :icon="item.icon" class="h-3 w-3 fill-current inline-block mr-2" />
            {{item.name}}
          </div>
        </router-link>
      </li>
    </ul>

    <ul class="list-reset mt-6 border-t border-grey pt-4" v-if="isLoggedIn">
      <li class="py-2"><User /></li>
      <li class="py-2" v-for="item of custom" :key="item.name">
        <router-link :to="{name: item.link}"
                     class=" text-grey-lightest hover:text-grey-light no-underline cursor-pointer text-base">
          <div @click="close()">
            <Zondicon :icon="item.icon" class="h-3 w-3 fill-current inline-block mr-2"/>
            {{item.name}}
          </div>
        </router-link>
      </li>
    </ul>

    <ul class="list-reset mt-6 border-t border-grey pt-4">
      <li v-if="!isLoggedIn"
          class="text-grey-lightest no-underline cursor-pointer text-base">
        <Zondicon icon="ArrowOutlineRight" class="h-3 w-3 fill-current inline-block mr-2 mt-1" />
          <router-link to="/signup" class=" text-grey-lightest hover:text-grey-light no-underline cursor-pointer text-base">
            Signup
          </router-link>
          /
          <span @click="login()" class=" hover:text-grey-light "> Login</span>
      </li>
      <li @click="logout()"
          v-if="isLoggedIn"
          class="text-grey-lightest hover:text-grey-light no-underline cursor-pointer text-base">
        <Zondicon icon="ArrowOutlineLeft" class="h-3 w-3 fill-current inline-block  mr-2 mt-1" />
          Logout
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import datastore from '../services/datastore';
import User from './User';

export default {
  name: 'Sidenav',
  components: { 
    User
  },
  props: {
    show: Boolean
  },
  computed: {
    isLoggedIn() {
      return datastore.getCurrentUser();
    }
  },
  data() {
    return {
      overlay: false,
      links: [
        {
          name: 'Search',
          link: 'search',
          icon: 'Search'
        },
        // {
        //   name: 'Genres',
        //   link: ''
        // },
        {
          name: 'Artists',
          link: 'artists',
          icon: 'MusicArtist'
        },
        {
          name: 'Newest Shows',
          link: 'newest',
          icon: 'MusicAlbum'
        },
        {
          name: 'Random Show',
          link: 'random',
          icon: 'Shuffle'
        },
        {
          name: 'Playing Now',
          link: 'live',
          icon: 'Globe'
        },
        {
          name: 'Queue',
          link: 'queue',
          icon: 'MusicPlaylist',
          hideLoggedIn: true
        }
      ],
      custom: [
        {
          name: 'Queue',
          link: 'queue',
          icon: 'MusicPlaylist'

        },
        {
          name: 'Favorite Artists',
          link: 'favoriteArtists',
          icon: 'Heart'
        },
        {
          name: 'Favorite Shows',
          link: 'favoriteShows',
          icon: 'Heart'
        },
        {
          name: 'Recently Played',
          link: 'recent',
          icon: 'Calendar'
        }
      ]
    };
  },
  methods: {
    ...mapActions('playlist', [
      'addTracks'
    ]),
    async login() {
      await datastore.login();

      // Set queue from datastore
      const queue = await datastore.getQueue();
      this.addTracks(queue);
    },
    async logout() {
      datastore.logout();
      this.$router.push('/');
    },
    close() {
      this.$emit('close');
    },
    overlayAdd() {
      document.body.classList.add('overflow-hidden');

      this.overlay = document.createElement('div');
      this.overlay.style.position = 'fixed';
      this.overlay.style.backgroundColor = 'black';
      this.overlay.style.opacity = 0.3;
      this.overlay.style.top = 0;
      this.overlay.style.bottom = 0;
      this.overlay.style.right = 0;
      this.overlay.style.left = 0;
      this.overlay.style.zIndex = 1001;
      document.body.appendChild(this.overlay);
      this.overlay.addEventListener('click', this.close, false);
    },
    overlayRemove() {
      document.body.classList.remove('overflow-hidden');
      document.body.removeChild(this.overlay);
      this.overlay.removeEventListener('click', this.close, false);
    }
  },
  watch: {
    show(isOpen) {
      if (isOpen) {
        this.overlayAdd();
      } else {
        this.overlayRemove();
      }
    }
  }
};
</script>

<style scoped lang="less">
  .w-240 {
    width: 240px
  }

  @media (max-width: 576px) {
    .sidenav {
      position: fixed !important;
      z-index: 1002 !important;
      top: 64px !important;
      bottom: 95px !important;
      left:-270px;
      -webkit-transition: all .3s ease;
      -moz-transition: all .3s ease;
      -o-transition: all .3s ease;
      -ms-transition: all .3s ease;
      transition: all .3s ease;

      &.visible {
        left: 0px;
      }
    }
  }

</style>

