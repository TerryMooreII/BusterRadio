<template>
  <span>
     <div class="flex justify-center mb-2">
      <ArtistImage classes="rounded-full border border-grey p-2 artist-image" :artist="artist" />
    </div>
    <div class="flex justify-center border-b  border-grey mb-2 sticky pin-t bg-white">
      <h1 class="py-4 ">{{artist.title}}</h1>
    </div>
  </span>
</template>

<script>
import ArtistImage from '../components/ArtistImage';

export default {
  name: 'ArtistHeader',
  components: {
    ArtistImage
  },
  props: {
    artist: Object
  }
};
</script>
