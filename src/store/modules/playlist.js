import player from '../../services/player';

const LOCALSTORAGE = {
  QUEUE: 'queue'
}

const state = {
  queue: JSON.parse(localStorage.getItem(LOCALSTORAGE.QUEUE)) || [],
  qIdx: null,
  isPlaying: false,
  duration: 0,
  currentTime: 0
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
    player.load(state.queue[0]);
    commit('isPlaying', true);
    commit('setqIdx', 0);
  },

  addTrack({ commit, state }, track) {
    commit('add', [...state.queue, track]);
    player.load(state.queue[state.queue.length - 1]);
    commit('isPlaying', true);
    commit('setqIdx', state.queue.length - 1);
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
      player.load(state.queue[0]);
      commit('isPlaying', true);
      commit('setqIdx', 0);
    } else if (state.queue.length) {
      player.play();
      commit('isPlaying', true);
    }
  },

  playQueueTrack({ commit, state }, index) {
    player.load(state.queue[index]);
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
      player.load(state.queue[getters.nextTrackIndex]);
      commit('isPlaying', true);
      commit('setqIdx', getters.nextTrackIndex);
    }
  },

  previous({ commit, state, getters }) {
    if (state.queue.length && getters.previousTrackIndex !== null) {
      player.load(state.queue[getters.previousTrackIndex]);
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
  },

  setqIdx(state, index) {
    state.qIdx = index;
  },

  isPlaying(state, value) {
    state.isPlaying = value;
  },

  setDuration(state, duration) {
    state.duration = duration;
  },

  setCurrentTime(state, currentTime) {
    state.currentTime = currentTime;
  }
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
