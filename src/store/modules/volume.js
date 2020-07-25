import player from '../../services/player';

const state = {
  isMuted: false,
  level: 0.8
};

const getters = { };

// actions
const actions = {
  setLevel({ commit }, level) {
    commit('setLevel', level);
    player.setVolume(level);
  },
  mute({ commit }) {
    commit('setIsMuted', true);
    player.mute(true);
  },
  unmute({ commit }) {
    commit('setIsMuted', false);
    player.mute(false);
  }
};

// mutations
const mutations = {
  setLevel(state, level) {
    state.level = level;
  },
  setIsMuted(state, val) {
    state.isMuted = val;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
