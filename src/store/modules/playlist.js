import player from '../../services/player';
import datastore from '../../services/datastore';

const LOCALSTORAGE = {
  QUEUE: 'queue'
};

const loadTrack = (track) => {
  player.load(track);
  if (datastore.getCurrentUser()) {
    datastore.addRecent(track);
  }
  datastore.addLive(track);
};


const state = {
  queue: JSON.parse(localStorage.getItem(LOCALSTORAGE.QUEUE)) || [],
  qIdx: null,
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  buffer: 0
};

const getqIdxAndLoad = () => {
  const savedQueue = JSON.parse(localStorage.getItem(LOCALSTORAGE.QUEUE));
  if (!savedQueue) return null;

  const idx = savedQueue.findIndex(track => track.isPlaying);
  if (idx == null) return null;

  player.load(state.queue[idx], false);
  player.seek(state.queue[idx].currentTime);

  return idx;
};

const getters = {
  queue(state) {
    return state.queue;
  },
  currentTrack(state) {
    return state.qIdx != null ? state.queue[state.qIdx] : {};
  },
  nextTrackIndex(state) {
    if (state.qIdx !== null) {
      const idx = state.qIdx + 1;
      return idx < state.queue.length ? idx : null;
    }
    return null;
  },
  previousTrackIndex(state) {
    if (state.qIdx !== null) {
      const idx = state.qIdx - 1;
      return idx >= 0 ? idx : null;
    }
    return null;
  },
  isPlaying(state) {
    return state.isPlaying;
  }
};

// actions
const actions = {
  clear({ commit }) {
    localStorage.removeItem(LOCALSTORAGE.QUEUE);
    commit('clear');
  },

  addTracks({ commit }, tracks) {
    commit('add', tracks);
    loadTrack(state.queue[0]);
    commit('isPlaying', true);
    commit('setqIdx', 0);
  },

  addTrack({ commit, state }, track) {
    let index;
    // This checks to see if the file is in queue and plays that one
    const isTrackInQueue = state.queue.find((t, i) => {
      const match = t.file === track.file;
      if (match) {
        index = i;
      }
      return match;
    });

    if (isTrackInQueue == null) {
      commit('add', [...state.queue, track]);
      index = state.queue.length - 1;
    }

    loadTrack(state.queue[index]);
    commit('setqIdx', index);
    commit('isPlaying', true);
  },

  addTrackToQueue({ commit, state }, track) {
    commit('add', [...state.queue, track]);
  },

  addTracksToQueue({ commit, state }, tracks) {
    commit('add', [...state.queue, ...tracks]);
  },

  addTrackToQueuePlayNext({ commit, state }, track) {
    const newQ = [...state.queue];
    newQ.splice(state.qIdx + 1, 0, track);
    commit('add', [...newQ]);
  },

  play({ commit, state }) {
    if (state.queue.length && state.qIdx === null) {
      loadTrack(state.queue[0]);
      commit('isPlaying', true);
      commit('setqIdx', 0);
    } else if (state.queue.length) {
      player.play();
      commit('isPlaying', true);
    }
  },

  playQueueTrack({ commit, state }, index) {
    loadTrack(state.queue[index]);
    commit('isPlaying', true);
    commit('setqIdx', index);
  },

  pause({ commit, state }) {
    if (state.isPlaying) {
      player.pause();
      commit('isPlaying', false);
    }
  },

  next({ commit, state, getters }) {
    if (state.queue.length && getters.nextTrackIndex !== null) {
      const track = state.queue[getters.nextTrackIndex];
      loadTrack(track);
      commit('isPlaying', true);
      commit('setqIdx', getters.nextTrackIndex);
    } else {
      commit('isPlaying', false);
    }
  },

  previous({ commit, state, getters }) {
    if (state.queue.length && getters.previousTrackIndex !== null) {
      loadTrack(state.queue[getters.previousTrackIndex]);
      commit('isPlaying', true);
      commit('setqIdx', getters.previousTrackIndex);
    }
  },

  duration({ commit }, duration) {
    commit('setDuration', duration);
  },

  currentTime({ commit }, currentTime) {
    commit('setCurrentTime', currentTime);
  },

  buffer({ commit }, buffer) {
    commit('setBuffer', buffer);
  },

  seek({ commit }, time) {
    player.seek(time);
    commit('setCurrentTime', time);
  }
};

// mutations
const mutations = {
  clear(state) {
    if (state.isPlaying) {
      const playing = state.queue[state.qIdx];
      state.queue = [playing];
      state.qIdx = 0;
    } else {
      state.queue = [];
    }
  },

  add(state, track) {
    state.queue = track;
    localStorage.setItem(LOCALSTORAGE.QUEUE, JSON.stringify(state.queue));
    if (datastore.getCurrentUser()) {
      datastore.setQueue(state.queue);
    }
  },

  setqIdx(state, index) {
    state.qIdx = index;
    state.queue.forEach((track) => {
      track.isPlaying = false;
      track.currentTime = 0;
    });
    state.queue[index].isPlaying = true;
    state.queue[index].hasPlayed = true;
    localStorage.setItem(LOCALSTORAGE.QUEUE, JSON.stringify(state.queue));
    if (datastore.getCurrentUser()) {
      datastore.setQueue(state.queue);
    }
  },

  isPlaying(state, value) {
    state.isPlaying = value;
  },

  setDuration(state, duration) {
    state.duration = duration;
  },

  setCurrentTime(state, currentTime) {
    state.currentTime = currentTime;
    state.queue[state.qIdx].currentTime = currentTime;
    localStorage.setItem(LOCALSTORAGE.QUEUE, JSON.stringify(state.queue));
  },

  setBuffer(state, buffer) {
    state.buffer = buffer;
  }
};
state.qIdx = getqIdxAndLoad();

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
