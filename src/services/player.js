import store  from '../store';
import ArchiveApi from '../api/archive';


class Player {
  isMuted = false;
  isLoop = false;
  volume = .8;

  constructor(){
    this.audio = new Audio();
    
    this.audio.addEventListener('loadeddata', () => {
      store.dispatch('playlist/duration', this.audio.duration);
      this.audio.volume = this.volume;
      this.audio.muted = this.isMuted;
      this.play();
    });

    this.audio.addEventListener('progress', () => {
      const endBuf = this.audio.buffered.end(0);
      const soFar = parseInt(((endBuf / this.audio.duration) * 100));
      console.log('Buffered: ' + soFar);
    });

    this.audio.addEventListener('ended', () => {
      //get next song from vuex 

    })

    this.audio.addEventListener('timeupdate', () => {
      store.dispatch('playlist/currentTime', this.audio.currentTime);
    })

    this.audio.addEventListener('volumechanged', () => {
      console.log('volumed changed');
    });

    this.audio.addEventListener('error', () => {
      console.log('Audio Error');

    })

  }

  load(track) {
    this.audio.src = ArchiveApi.trackUrl(track);
  }

  play() {
    this.audio.play()
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0.0;
  }

  mute(val = !this.isMuted) {
    this.isMuted = val;
    this.audio.muted = val;
  }

  seek(time){
    this.audio.currentTime = time;
  }

  loop () {
    this.isLoop = !this.isLoop;
    this.audio.loop = this.isLoop;
  }

  setVolume(level) {
    this.volume = level;
    this.mute(false);
    this.audio.volume = level;
  }
}

export default new Player();