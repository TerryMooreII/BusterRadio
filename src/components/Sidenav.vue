<template>
  <div class="flex-none text-grey-darker px-8 w-240 py-10 border-grey-light border-r border-solid sidenav ">
    <ul class="list-reset">
      <li class="text-xs antialiased uppercase border-b border-solid border-grey pb-2 mb-2 text-grey-darkest">
         Getting started
      </li> 
      <li class="text-sm py-1" v-for="item of links" :key="item.name">
        <a v-href="item.link" class="antialiased text-grey-dark hover:text-grey-darkest no-underline cursor-pointer">
          {{item.name}}
        </a>
      </li>       
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidenav',
  props: {

  },
  data () {
    return {
      links: [
        {
          name: 'Artists',
          link: ''
        },
        {
          name: 'Top Played Artist',
          link: ''
        },
        {
          name: 'Genres',
          link: ''
        },
        {
          name: 'New Added Shows',
          link: ''
        },
        {
          name: 'Newest Shows By Date',
          link: ''
        },
        {
          name: 'Play Random Show',
          link: ''
        },
        {
          name: 'What\'s Playing Now',
          link: ''
        },
      ]
    }
  },
  methods: {
    
  }
};
</script>

<style scoped lang="less">
  .w-240 {
    width: 240px
  }
</style>

