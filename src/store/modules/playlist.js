import player from "../../services/player";



const state = {
  queue: [],
  currentSongIndex: null,
  isPlaying: false,
  duration: 0,
  currentTime: 0
};


const getters = {
  queue(state) {
    return state.queue;
  },
  // currentSong(state) {
  
  //   return state.currentSongIndex ? state.queue[state.currentSongIndex] : null;
  // },
};

// actions
const actions = {
  addTracks({ commit }, tracks ) {
    commit('add', tracks);
  },

  addTrack({ commit, state }, track ) {
    commit('add', [...state.queue, track]);
  },

  play({ commit, state }) {
    if (!state.currentSongIndex && state.queue.length) {
      player.load(state.queue[0]);
      commit('isPlaying', true);
    } else if (state.queue.length) {
      player.play();
      commit('isPlaying', true);
    }
  },

  pause({ commit, state }) {
    if (state.isPlaying){
      player.pause();
      commit('isPlaying', false);
    }
  },

  duration({ commit }, duration){
    commit('setDuration', duration);
  },

  currentTime({ commit }, currentTime){
    commit('setCurrentTime', currentTime);
  }
 };

// mutations
const mutations = {
  add (state, track) {
    state.queue = track;
  },

  isPlaying(state, value) {
    state.isPlaying = value;
  },
  
  setDuration(state, duration){
    state.duration = duration;
  },

  setCurrentTime(state, currentTime){
    state.currentTime = currentTime;
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}