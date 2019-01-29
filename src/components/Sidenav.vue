<template>
  <div class="pb-16 w-285 sm:visible sidenav sm:min-h-screen text-grey-darkest"
       :class="{'visible': show === true, 'invisible': show === false}">

    <div class=" sticky pin-t">

    <div class="flex items-center tracking-wide pt-8 pl-12">
      <Zondicon icon="Radio" class="play-icon h-5 w-5 fill-current inline-block mr-2 -mt-1 text-grey-darker hidden sm:block" />
      <span class="font-semibold text-xl tracking-tight tracking-normal hidden sm:block">BusterRadio</span>
    </div>

    <ul class="nav">
      <li  v-for="item of links" :key="item.name">
        <router-link :to="{name: item.link}" v-if="(!item.hideLoggedIn || !isLoggedIn)"
                     class="nav-item"
                     :exact="item.exact">
          <div @click="close()">
            <Zondicon :icon="item.icon" class="nav-icon" />
            {{item.name}}
          </div>
        </router-link>
      </li>
    </ul>

    <ul class="nav">
      <li class="py-2 font-bold" v-if="isLoggedIn"><User /></li>
      <li class="" v-for="item of custom" :key="item.name" v-if="isLoggedIn">
        <router-link :to="{name: item.link}"
                     class="nav-item">
          <div @click="close()">
            <Zondicon :icon="item.icon" class="nav-icon"/>
            {{item.name}}
          </div>
        </router-link>
      </li>
      <li v-if="!isLoggedIn">
        
        <router-link to="/signup" class="nav-item">
        <Zondicon icon="User" class="nav-icon" />
          Signup
        </router-link>
      </li>
      <li v-if="!isLoggedIn">
          <div class="nav-item cursor-pointer">
            <Zondicon icon="ArrowOutlineRight" class="nav-icon" />
             <span @click="login()" > Login</span>
          </div>
      </li>
      <li @click="logout()"
          v-if="isLoggedIn"
          class="nav-item cursor-pointer">
        <Zondicon icon="ArrowOutlineLeft" class="nav-icon mr-3" />
          Logout
      </li>
    </ul>
  </div>
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
          icon: 'MusicAlbum',
          //exact: true
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
          name: 'Favorites',
          link: 'favoriteArtists',
          icon: 'Heart'
        },
        {
          name: 'History',
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

<style lang="postcss" scoped>
  .nav {
    @apply .list-reset .m-2 .mx-6 .py-4 .pl-6
  }

  .nav-white {
    @apply .bg-white .rounded .shadow .mb-4
  }

  .nav-item {
     @apply  .text-grey-darkest .no-underline .py-2 .px-4 .my-1 .flex .items-center .text-sm
  }
  .nav-icon {
    @apply .h-3 .w-3 .fill-current .inline-block .mr-2
  }

  .nav-item:hover {
    @apply .block .bg-blue-dark .text-white .rounded
  }
  
  .router-link-active {
    @apply .block .bg-blue-dark .text-white .rounded
  }

  @media (max-width: 576px) {
    .sidenav{
      @apply .bg-grey-lightest
    }
     
  }
</style>


<style scoped lang="less">

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
      overflow-x: scroll;

      &.visible {
        left: 0px !important;
      }
    }
  }

</style>

