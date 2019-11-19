import store from '../store';

const hasMediaSession = 'mediaSession' in navigator;

if (hasMediaSession) {
  navigator.mediaSession.setActionHandler('play', () => store.dispatch('playlist/play'));
  navigator.mediaSession.setActionHandler('pause', () => store.dispatch('playlist/pause'));
  // navigator.mediaSession.setActionHandler('seekbackward', function() {});
  // navigator.mediaSession.setActionHandler('seekforward', function() {});
  navigator.mediaSession.setActionHandler('previoustrack', () => store.dispatch('playlist/previous'));
  navigator.mediaSession.setActionHandler('nexttrack', () => store.dispatch('playlist/next'));
}

// eslint-disable-next-line object-curly-newline
const setMetaData = ({ artist, title, album, image }) => {
  console.log(artist, title, album, image);
  if (!hasMediaSession) return;

  // eslint-disable-next-line no-undef
  navigator.mediaSession.metadata = new MediaMetadata({
    title,
    artist,
    album,
    artwork: [
      { src: image, sizes: '96x96', type: 'image/jpeg' },
      { src: image, sizes: '128x128', type: 'image/jpeg' },
      { src: image, sizes: '192x192', type: 'image/jpeg' },
      { src: image, sizes: '256x256', type: 'image/jpeg' },
      { src: image, sizes: '384x384', type: 'image/jpeg' },
      { src: image, sizes: '512x512', type: 'image/jpeg' },

    ]
  });
};

const setPositionState = (/* duration, position */) => {
  // navigator.mediaSession.setPositionState({
  //   duration,
  //   playbackRate: 1,
  //   position
  // });
};

const setPlaybackState = (isPlaying) => {
  console.log('is', isPlaying);
  navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
};

export default {
  setMetaData,
  setPositionState,
  setPlaybackState
};
