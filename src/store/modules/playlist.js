
const state = {
  queue: []
};


const getters = {
  queue(state) {
    return state.queue;
  },
  currentSong(state) {
    return state.queue.find(song => song.isPlaying);
  },

};

// actions
const actions = { };

// mutations
const mutations = {
  add(state, {items}) {
    if (Array.isArray(items)) {
      state.queue = items;
    } else {
      state.queue = items;
    }
  },
  remove(state, { index }) {
    state.query.splice(index, 1);
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}