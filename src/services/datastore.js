import firebase from 'firebase';

const sanitizeShow = show => Object.keys(show).reduce((acc, s) => {
  if (typeof show[s] !== 'undefined' && typeof show[s] !== 'function') {
    acc[s] = show[s];
  }
  return acc;
}, {});

export default {
  getCurrentUser() {
    return firebase.auth().currentUser;
  },

  async login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      this.currentUser = await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error(error);
    }
  },
  async logout() {
    try {
      await firebase.auth().signOut();
      this.currentUser = firebase.auth().currentUser;
    } catch (error) {
      console.log('Unable to logout');
    }
  },

  async getFavoriteArtists() {
    if (!this.getCurrentUser()) {
      return [];
    }

    const snapshot = await firebase.database()
      .ref(`favorite-artist/${this.getCurrentUser().uid}`)
      .once('value');
    return snapshot.val();
  },

  async isFavoriteArtist(artist) {
    if (!this.getCurrentUser()) {
      return null;
    }
    const snapshot = await firebase.database()
      .ref(`favorite-artist/${this.getCurrentUser().uid}`)
      .equalTo(artist.identifier)
      .orderByChild('identifier')
      .once('value');
    return snapshot.val();
  },

  async addFavoriteArtist(artist) {
    await firebase.database()
      .ref(`favorite-artist/${this.getCurrentUser().uid}`).push(artist);
  },

  async removeFavoriteArtist(artist) {
    Object.keys(artist).forEach(async (key) => {
      await firebase.database()
        .ref(`favorite-artist/${this.getCurrentUser().uid}/${key}`)
        .remove();
    });
  },

  async getFavoriteShows() {
    if (!this.getCurrentUser()) {
      return [];
    }

    const snapshot = await firebase.database()
      .ref(`favorite-show/${this.getCurrentUser().uid}`)
      .once('value');
    return snapshot.val();
  },

  async isFavoriteShow(show) {
    if (!this.getCurrentUser()) {
      return null;
    }

    // Deleting methods on show object
    // cause firebase dont like those
    show = sanitizeShow(show);

    const snapshot = await firebase.database()
      .ref(`favorite-show/${this.getCurrentUser().uid}`)
      .equalTo(show.identifier)
      .orderByChild('identifier')
      .once('value');
    return snapshot.val();
  },

  async addFavoriteShow(show) {
    // Deleting methods on show object
    // cause firebase dont like those
    show = sanitizeShow(show);
    await firebase.database()
      .ref(`favorite-show/${this.getCurrentUser().uid}`).push(show);
  },

  async removeFavoriteShow(show) {
    Object.keys(show).forEach(async (key) => {
      await firebase.database()
        .ref(`favorite-show/${this.getCurrentUser().uid}/${key}`)
        .remove();
    });
  },

  async getRecents() {
    if (!this.getCurrentUser()) {
      return [];
    }

    const snapshot = await firebase.database()
      .ref(`recent-tracks/${this.getCurrentUser().uid}`).limitToLast(100)
      .once('value');
    return snapshot.val();
  },

  async addRecent(track) {
    await firebase.database()
      .ref(`recent-tracks/${this.getCurrentUser().uid}`).push(track);
  },

  async getLive() {
    const snapshot = await firebase.database()
      .ref('live').limitToLast(100)
      .once('value');
    return snapshot.val();
  },

  async addLive(track) {
    await firebase.database()
      .ref('live').push(track);
  },

  async getQueue() {
    if (!this.getCurrentUser()) {
      return [];
    }

    const snapshot = await firebase.database()
      .ref(`queue/${this.getCurrentUser().uid}`)
      .once('value');
    return snapshot.val();
  },

  async setQueue(queue) {
    if (!this.getCurrentUser()) {
      return;
    }
    await firebase.database()
      .ref(`queue/${this.getCurrentUser().uid}`).set(queue);
  },

  async getPlaylistsPrivate() {
    if (!this.getCurrentUser()) {
      return [];
    }

    const snapshot = await firebase.database()
      .ref(`playlists-private/${this.getCurrentUser().uid}`)
      .once('value');
    return snapshot.val();
  },

  async addPlaylistPrivate(playlist) {
    await firebase.database()
      .ref(`playlists-private/${this.getCurrentUser().uid}`).push(playlist);
  },

  async getPlaylistsPublic() {
    const snapshot = await firebase.database()
      .ref('playlists-public')
      .once('value');
    return snapshot.val();
  },

  async addPlaylistPublic(playlist) {
    await firebase.database()
      .ref('playlist-public').push(playlist);
  }
};


/*
  {
    $key: poi312i3,
    title: My Dead List,
    user: TerryMooreII,
    description: Maybe
    isPublic: true,
    tracks: [
      {}
    ]
  }
*/
