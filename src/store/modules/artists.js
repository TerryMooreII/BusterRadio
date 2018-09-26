import ArchiveApi from '../../api/archive';

const ARTISTS = 'artists';

const state = {
  all: JSON.parse(window.localStorage.getItem(ARTISTS) || '[]')
};


const getters = {
  all(state) {
    return state.all;
  },
  artist: (state) => (search) => state.all.find(artist => { 
    return artist.title === search || artist.identifier === search
  }),
  artistsByDownloads (state) { 
    return [...state.all.slice().sort((a, b) => b.downloads - a.downloads)]
  },
  search: (state) => (search) => state.all.filter(artist => { 
    return artist.title.toLowerCase().includes(search.toLowerCase())
  }),
};

// actions
const actions = {
  getArtists({ commit }) {
    return ArchiveApi.getAllArtists()
      .then(artists => {
        localStorage.setItem(ARTISTS, JSON.stringify(artists));
        commit('setArtists', { artists })
      })
  },
  findArtistById ({ state, commit }, identifier) {
    console.log(identifier);
    const artist = state.all.find(artist => artist.title === identifier);
    commit('setArtist', { artist })
  }
};

// mutations
const mutations = {
  setArtists(state, { artists }) {
    state.all = artists;
  },
  setArtist (state, { artist }) {
    state.artist = artist;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}