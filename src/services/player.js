import store from '../store';
import ArchiveApi from '../api/archive';


class Player {
  isLoop = false;
  volume = 0.8;
  playOnLoad = true;

  constructor() {
    this.audio = new Audio();

    this.audio.addEventListener('loadeddata', () => {
      store.dispatch('playlist/duration', this.audio.duration);
      this.audio.volume = store.state.volume.level;
      this.audio.muted = store.state.volume.isMuted;
      if (this.playOnLoad) {
        this.play();
      }
    });

    this.audio.addEventListener('progress', () => {
      store.dispatch('playlist/buffer', this.audio.buffered.end(0));
    });

    this.audio.addEventListener('ended', () => {
      store.dispatch('playlist/next');
    });

    this.audio.addEventListener('timeupdate', () => {
      store.dispatch('playlist/currentTime', this.audio.currentTime);
    });

    this.audio.addEventListener('volumechanged', () => {
      console.log('volumed changed');
    });

    this.audio.addEventListener('error', () => {
      console.log('Audio Error');
    });
  }

  load(track, playOnLoad = true) {
    this.audio.src = ArchiveApi.trackUrl(track);
    this.playOnLoad = playOnLoad;
  }

  play() {
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0.0;
  }

  mute(val) {
    this.audio.muted = val;
  }

  seek(time) {
    this.audio.currentTime = time;
  }

  loop() {
    this.isLoop = !this.isLoop;
    this.audio.loop = this.isLoop;
  }

  setVolume(level) {
    this.volume = level;
    store.dispatch('volume/unmute');
    this.audio.volume = level;
  }
}

export default new Player();
