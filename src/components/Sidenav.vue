<template>
  <div class="flex-none text-grey-darker px-8 w-240 pt-4 border-grey-light border-r border-solid bg-blue-dark sm:visible sidenav" 
       :class="{'visible': show === true, 'invisible': show === false}">
    <div class="flex items-center flex-no-shrink text-white mr-6 tracking-wide">
      <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/>
      </svg>
      <span class="font-semibold text-xl tracking-tight tracking-normal">BusterRadio</span>
    </div>

    <ul class="list-reset mt-6 border-t border-solid border-grey pt-4">
      <li class="text-sm py-2" v-for="item of links" :key="item.name">
        <router-link :to="{name: item.link}" 
                     class="antialiased text-grey-lightest hover:text-grey no-underline cursor-pointer text-lg">
          <div @click="$emit('close')">
            <component v-bind:is="item.icon" v-bind:cssClass="'h-4 w-4 fill-current text-white inline-block self-center mr-2 -mt-2'" /> 
            {{item.name}}
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import icons from '../icons';

export default {
  name: 'Sidenav',
  components: {
    Search: icons.Search,
    MusicArtist: icons.MusicArtist,
    MusicAlbum: icons.MusicAlbum
  },
  props: {
    show: Boolean
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
          name: 'Lastest Shows',
          link: 'newest',
          icon: 'MusicAlbum'
        }

        // {
        //   name: 'Play Random Show',
        //   link: ''
        // },
        // {
        //   name: 'What\'s Playing Now',
        //   link: ''
        // },
      ]
    };
  },
  methods: {

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

