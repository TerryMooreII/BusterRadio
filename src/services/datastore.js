import firebase from 'firebase';

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
  }
};

