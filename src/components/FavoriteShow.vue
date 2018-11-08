<template>
  <div class="inline-block" @click="toggle()" :class="{'right': right}" v-if="isLoggedIn">
    <Zondicon icon="Heart" :class="clazz"/>
  </div>
</template>

<script>
import datastore from '../services/datastore';

export default {
  name: 'FavoriteShow',
  props: {
    show: Object,
    right: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    clazz() {
      return `heart ${Boolean(this.favorite) ? 'favorite text-red-dark hover:text-red' : '' } h-5 w-5 fill-current text-grey-dark hover:text-grey-darkest cursor-pointer`
    },
    isLoggedIn() {
      return datastore.getCurrentUser();
    }
  },
  data() {
    return {
      favorite: null
    };
  },
  methods: {
    toggle() {
      if (!datastore.getCurrentUser()) {
        console.log('Need to login');
        return;
      }

      if (this.favorite) {
        this.unfavorite();
      } else {
        this.addFavorite();
      }
    },

    async isFavorite() {
      this.favorite = await datastore.isFavoriteShow(this.show);
    },

    async addFavorite() {
      await datastore.addFavoriteShow(this.show);
      await this.isFavorite();
    },
    async unfavorite() {
      await datastore.removeFavoriteShow(this.favorite);
      await this.isFavorite();
    }
  },
  mounted() {
    this.isFavorite();
  }
};
</script>

<style scoped lang="less">
  .heart {
    &.favorite {
      display: block !important;
    }
  }

  .card:hover {
    .heart {
      display: block;
    }
  }

  .right {
    position: absolute;
    right: 4px;
    top: 4px;
  }
</style>
