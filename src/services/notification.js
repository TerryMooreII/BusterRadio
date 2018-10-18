
export default {
  async requestPermission() {
    const result = await Notification.requestPermission();

    if (result === 'denied') {
      console.log('Permission wasn\'t granted. Allow a retry.');
      return false;
    }
    if (result === 'default') {
      console.log('The permission request was dismissed.');
      return false;
    }
    return true;
  },
  hasData(val) {
    return val || '';
  },
  send(track) {
    if (Notification.permission !== 'granted') {
      return this.requestPermission();
    }

    const options = {
      silent: true,
      noscreen: true,
      icon: `https://archive.org/services/img/${track.creator}`,
      body: `${this.hasData(track.creator)} ${this.hasData(track.album)}`
    };
    const notification = new Notification(this.hasData(track.title), options);

    setTimeout(() => {
      notification.close();
    }, 5000);

    return true;
  }
};
