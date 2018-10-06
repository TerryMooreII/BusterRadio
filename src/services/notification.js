
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
  send(message, image) {
    const defaultOptions = {
      image,
      silent: true,
      noscreen: true
    }
  }
}