const calcTrackTime = (track) => {
  if (!track && !track.length) {
    return '0:00';
  } if (track.length.includes('.')) {
    const t = track.length / 3600;
    const h = Math.floor(t);
    const m = Math.floor((t - h) * 60);
    const s = Math.floor(((t - h) * 60 - m) * 60);
    const pad = (unit) => (String(unit).length === 2 ? unit : `0${unit}`);
    return `${pad(m)}:${pad(s)}`;
  }
  return track.length;
};

const setTitle = (title) => document.title = `${title} :: BusterRadio`;

export default {
  calcTrackTime,
  setTitle
};
