<template>
  <Modal @dismiss="$emit('dismiss')">
    <template slot="header">
      <div class="px-3 mb-4">
        <h3 class="">
          {{recordings.venue}} <br>
          <span class="text-sm text-grey-darker">{{recordings.date | dateformat}}</span>
        </h3>
      </div>
    </template>
    <Recordings :date="recordings.date" :artist="artist" />
  </Modal>
</template>

<script>
import Modal from './Modal';
import Recordings from './Recordings';

export default {
  name: 'Recodings',
  components: {
    Modal,
    Recordings
  },
  props: {
    recordings: {
      type: Object,
      default: {}
    },
    artist: {
      type: Object,
      default: {}
    }
  }
};
</script>

