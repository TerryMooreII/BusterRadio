<template>
  <div class="flex-none text-grey-darker px-8 w-240 pt-4 border-grey-light border-r border-solid bg-blue-dark sm:visible sidenav" 
       :class="{'visible': show === true, 'invisible': show === false}">
    <div class="flex items-center flex-no-shrink text-white mr-6 tracking-wide ">
      <svg class="fill-current h-8 w-8 mr-2 hidden sm:block" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/>
      </svg>
      <!-- <img src="/img/pig-lg-grey.png" alt="logo" class="h-8 w-12"> -->
      <span class="font-semibold text-xl tracking-tight tracking-normal hidden sm:block">BusterRadio</span>
    </div>

    <ul class="list-reset mt-6 border-t border-solid border-grey pt-4">
      <li class="text-sm " v-for="item of links" :key="item.name">
        <router-link :to="{name: item.link}" v-if="!item.hideLoggedIn"
                     class="antialiased block py-2 text-grey-lightest hover:text-grey-light no-underline cursor-pointer text-lg">
          <div @click="$emit('close')">
            <component v-bind:is="item.icon" v-bind:cssClass="'h-4 w-4 fill-current inline-block self-center mr-2 -mt-2'" /> 
            {{item.name}}
          </div>
        </router-link>
      </li>
    </ul>

    <ul class="list-reset mt-6 border-t border-solid border-grey pt-4" v-if="isLoggedIn">
      <li class="text-sm py-2"><User /></li>
      <li class="text-sm py-2" v-for="item of custom" :key="item.name">
        <router-link :to="{name: item.link}" 
                     class="antialiased text-grey-lightest hover:text-grey-light no-underline cursor-pointer text-lg">
          <div @click="$emit('close')">
            <component v-bind:is="item.icon" v-bind:cssClass="'h-4 w-4 fill-current inline-block self-center mr-2 -mt-2'" /> 
            {{item.name}}
          </div>
        </router-link>
      </li>
    </ul>

    <ul class="list-reset mt-6 border-t border-solid border-grey pt-4">
      <li @click="login()" 
          v-if="!isLoggedIn"
          class="antialiased text-grey-lightest hover:text-grey-light no-underline cursor-pointer text-lg">
        <Login v-bind:cssClass="'h-4 w-4 fill-current inline-block self-center mr-2 mt-1'" />
          Login
      </li>
      <li @click="logout()" 
          v-if="isLoggedIn"
          class="antialiased text-grey-lightest hover:text-grey-light no-underline cursor-pointer text-lg">
        <Logout v-bind:cssClass="'h-4 w-4 fill-current inline-block self-center mr-2 mt-1'" />
          Logout
      </li>
    </ul>
  </div>
</template>

<script>
import datastore from '../services/datastore';
import icons from '../icons';
import User from './User';

export default {
  name: 'Sidenav',
  components: {
    Search: icons.Search,
    MusicArtist: icons.MusicArtist,
    MusicAlbum: icons.MusicAlbum,
    MusicPlaylist: icons.MusicPlaylist,
    Shuffle: icons.Shuffle,
    Heart: icons.Heart,
    Login: icons.Login,
    Logout: icons.Logout,
    Calendar: icons.Calendar,
    Globe: icons.Globe,
    User: User
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
          icon: 'MusicPlaylist',

        },
        {
          name: 'Favorite Artists',
          link: 'favoriteArtists',
          icon: 'Heart',
        },
        {
          name: 'Recently Played',
          link: 'recent',
          icon: 'Calendar',
        },
      ]
    };
  },
  methods: {
    async login() {
      return datastore.login();
    },
    async logout() {
      return datastore.logout();
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
      &.visible {
        left: 0px;
        position: inherit;
      }

      &.invisible {
        left:-270px;
        position: fixed !important;
      }
    }
  }



</style>

