import moment from 'moment';
import fetchJsonp from 'fetch-jsonp';


const URL = 'https://archive.org';
const JSONP = 'callback=callback&save=yes&output=json';
const COLLECTION_AND_MEDIATYPE = '/advancedsearch.php?q=mediatype%3Acollection+AND+collection%3Aetree&';
const COLLECTION = '/advancedsearch.php?q=collection%3Aetree&';
const FETCH_TIMEOUT = 10000
const cache = {};

const createApi = (query) => `${URL}${COLLECTION}${query.join('&')}&${JSONP}`;

const isSoundboard = (show) => {
  if (show.source && (show.source.toLowerCase().includes('soundboard') || show.source.toLowerCase().includes('sbd'))) {
    return true;
  }
  return false;
};

// This function ensures that is a file type doesnt have title and another does it will sync them up.
// If no title exists then it uses the file id.
const syncTitles = (tracks, trackTypes) => {
  const foundType = trackTypes.find((t) => Array.isArray(tracks[t]) && tracks[t].length && tracks[t][0].title);

  let titles = [];
  if (foundType) {
    titles = tracks[foundType].map((track) => track.title);
  } else {
    let exists;
    if (tracks.mp3.length) {
      exists = 'mp3';
    } else if (tracks.flac.length) {
      exists = 'flac';
    }

    if (exists) {
      titles = tracks[exists].map((track) => (track.file != null ? track.file.substring(1, track.file.length - 4) : ''));
    }
  }

  if (titles.length) {
    trackTypes.forEach((type) => {
      if (type !== foundType && tracks[type].length) {
        tracks[type].forEach((track, index) => track.title = titles[index]);
      }
    });
  }
  return tracks;
};

class Show {
  constructor(show) {
    this.dir = show.dir;
    this.image = show.misc.image;
    this.server = show.server;
    this.reviews = show.reviews;

    this.downloads = show.item && show.item.downloads;

    this.artist = this.sanitize(show.metadata.creator);
    this.date = this.sanitize(show.metadata.date);
    this.description = this.sanitize(show.metadata.description);
    this.location = this.sanitize(show.metadata.coverage);
    this.identifier = this.sanitize(show.metadata.identifier);
    this.lineage = this.sanitize(show.metadata.lineage);
    this.publicdate = this.sanitize(show.metadata.publicdate);
    this.source = this.sanitize(show.metadata.source);
    this.taper = this.sanitize(show.metadata.taper);
    this.title = this.sanitize(show.metadata.title);
    this.venue = this.sanitize(show.metadata.venue);
    this.year = this.sanitize(show.metadata.year);
    this.artist = this.sanitize(show.metadata.creator);
    this.tracks = this.getTracks(show.files);
    this.images = this.getImages(show.files);
  }

  sanitize = (item) => (item && Array.isArray(item) && item.length > 0 ? item[0] : null);

  getImages = (files) => Object.keys(files).filter((file) => file.endsWith('.jpg'));

  getTracks = (files) => {
    const tracks = {};
    const trackTypes = ['mp3', 'flac', 'ogg'];
    const sample = '_sample';
    trackTypes.forEach((trackType) => {
      tracks[trackType] = Object.keys(files)
        .filter((file) => file.endsWith(trackType) && !file.endsWith(`${sample}.${trackType}`))
        .map((file) => Object.assign(files[file], {
          file,
          identifier: this.identifier,
          server: this.server,
          artist: this.artist,
          dir: this.dir,
          venue: this.venue,
          year: this.year,
          image: this.image
        }));
    });

    return syncTitles(tracks, trackTypes);
  }
}

export default {
  trackUrl({ server, dir, file }) {
    return `//${server}${dir}${file}`;
  },
  getAllArtists() {
    const query = [
      'fl[]=identifier',
      'fl[]=title',
      'fl[]=downloads',
      'sort[]=titleSorter+asc',
      'rows=15000',
      'page=1'];

    return fetchJsonp(`${URL}${COLLECTION_AND_MEDIATYPE}${query.join('&')}&${JSONP}`, {
      timeout: FETCH_TIMEOUT
    })
      .then((response) => response.json())
      .then((response) => response.response.docs);
  },
  getLatestShows(orderby = 'publicdate', page = 1) {
    const query = [
      'fl[]=avg_rating',
      'fl[]=downloads',
      'fl[]=source',
      'fl[]=coverage',
      'fl[]=creator',
      'fl[]=date',
      'fl[]=identifier',
      'fl[]=title',
      'fl[]=year',
      'fl[]=venue',
      `sort[]=${orderby} desc`,
      'sort[]=',
      'sort[]=',
      'rows=50',
      `page=${page}`
    ];
    const url = createApi(query);
    const key = btoa(url);
    if (cache[key] && moment().diff(cache[key].timestamp, 'minutes') <= 30) {
      return Promise.resolve(cache[key].data);
    }

    return fetchJsonp(url, {
      timeout: FETCH_TIMEOUT
    })
      .then((response) => response.json())
      .then((response) => response.response.docs)
      .then((data) => {
        data = data.map((s) => ({ ...s, soundboard: isSoundboard(s) }));
        cache[key] = {
          data,
          timestamp: Date.now()
        };

        return data;
      });
  },
  getShow(id) {
    const url = `${URL}/details/${id}?${JSONP}`;
    const key = btoa(url);
    if (cache[key]) {
      return Promise.resolve(cache[key]);
    }
    return fetchJsonp(url, {
      timeout: FETCH_TIMEOUT
    })
      .then((response) => response.json())
      .then((response) => new Show(response))
      .then((data) => {
        cache[key] = data;
        return data;
      });
  },
  getMediaUrl(dir, file) {
    return `//www.archive.org/download/${dir}/${file}`;
  },
  getShows(artistId, year) {
    const query = [
      'fl[]=source',
      'fl[]=avg_rating',
      'fl[]=coverage',
      'fl[]=date',
      // 'fl[]=description',
      'fl[]=downloads',
      'fl[]=identifier',
      'fl[]=venue',
      'fl[]=year',
      'sort[]=date+asc',
      'sort[]=avg_rating+desc',
      'rows=15000',
      'page=1'
    ];
    const url = year != null
      ? `${URL}/advancedsearch.php?q=mediatype:(etree)+AND+collection:(${artistId})+AND+year:(${year})&${query.join('&')}&${JSONP}`
      : `${URL}/advancedsearch.php?q=mediatype:(etree)+AND+collection:(${artistId})&${query.join('&')}&${JSONP}`;
    const key = btoa(url);
    if (cache[key]) {
      return Promise.resolve(cache[key]);
    }

    return fetchJsonp(url, {
      timeout: FETCH_TIMEOUT
    })
      .then((response) => response.json())
      .then((response) => response.response.docs)
      .then((shows) => {
        const grouped = {};
        shows.forEach((show) => {
          Object.assign(show, { soundboard: isSoundboard(show) });

          if (!grouped[show.date]) {
            grouped[show.date] = Object.assign(show, { count: 1 });
          } else if (grouped[show.date] && show.soundboard && !grouped[show.date].soundboard) {
            const count = grouped[show.date].count + 1;
            grouped[show.date] = Object.assign(show, { count });
          } else if (grouped[show.date] && show.soundboard && !grouped[show.date].soundboard && (show.avg_rating > grouped[show.date].avg_rating) || !grouped[show.date].avg_rating) { // eslint-disable-line
            const count = grouped[show.date].count + 1;
            grouped[show.date] = Object.assign(show, { count });
          } else if (grouped[show.date] && (show.avg_rating > grouped[show.date].avg_rating || 0)) {
            const count = grouped[show.date].count + 1;
            grouped[show.date] = Object.assign(show, { count });
          } else {
            const count = grouped[show.date].count + 1;
            grouped[show.date] = Object.assign(grouped[show.date], { count });
          }
        });
        return grouped;
      }).then((data) => {
        cache[key] = data;
        return data;
      });
  },
  getShowsByDate(artistId, date) {
    const query = [
      'fl[]=source',
      'fl[]=avg_rating',
      'fl[]=publicdate',
      'fl[]=date',
      'fl[]=publisher',
      'fl[]=contributor',
      'fl[]=downloads',
      'fl[]=identifier',
      'fl[]=venue',
      'fl[]=year',
      'sort[]=avg_rating+desc',
      'rows=15000',
      'page=1'
    ];
    const url = `${URL}/advancedsearch.php?q=mediatype:(etree)+AND+collection:(${artistId})+AND+date:(${date})&${query.join('&')}&${JSONP}`;
    const key = btoa(url);
    if (cache[key]) {
      return Promise.resolve(cache[key]);
    }
    return fetchJsonp(url, {
      timeout: FETCH_TIMEOUT
    })
      .then((response) => response.json())
      .then((response) => response.response.docs)
      .then((shows) => shows
        .sort((a, b) => b.avg_rating - a.avg_rating)
        .sort((a, b) => b.downloads - a.downloads))
      .then((data) => {
        cache[key] = data;
        return data;
      });
  },
  getYears(artist) {
    const query = [
      'fl[]=year',
      'fl[]=date',
      'sort[]=year+desc',
      'rows=15000',
      'page=1'
    ];
    const url = `${URL}/advancedsearch.php?q=mediatype:(etree)+AND+collection:(${artist})&${query.join('&')}&${JSONP}`;
    const key = btoa(url);
    if (cache[key]) {
      return Promise.resolve(cache[key]);
    }

    return fetchJsonp(url, {
      timeout: FETCH_TIMEOUT
    })
      .then((response) => response.json())
      .then((response) => response.response.docs)
      .then((response) => {
        const obj = {};
        response.forEach((show) => {
          if (obj[show.year]) {
            obj[show.year].push(show.date);
          } else {
            obj[show.year] = [show.date];
          }
        });

        const ret = [];
        Object.keys(obj).forEach((year) => {
          const total = Array.from(new Set(obj[year])).length;
          obj[year] = total;
          ret.push({
            year, total
          });
        });
        return ret.sort((a, b) => a.year - b.year);
      })
      .then((data) => {
        cache[key] = data;
        return data;
      });
  },

  downloadShowUrl(identifier, fileType) {
    let format;
    switch (fileType) {
      case 'ogg':
        format = 'OGG%20VORBIS';
        break;
      case 'flac':
        format = 'FLAC';
        break;
      default:
        format = 'VBR%20MP3';
        break;
    }
    return `https://archive.org/compress/${identifier}/formats=${format}&file=/${identifier}.zip`;
  },
  getArchiveUrl(identifier) {
    return `https://archive.org/details/${identifier}`;
  },

  search({
    property,
    searchTerm,
    page = 1,
    count = 50,
    orderby = 'publicdate'
  } = {}) {
    const query = [
      'fl[]=avg_rating',
      'fl[]=downloads',
      'fl[]=description',
      'fl[]=coverage',
      'fl[]=creator',
      'fl[]=date',
      'fl[]=identifier',
      'fl[]=title',
      'fl[]=year',
      'fl[]=venue',
      `sort[]=${orderby} desc`,
      'sort[]=',
      'sort[]=',
      `rows=${count}`,
      `page=${page}`
    ];
    let filter;

    if (Array.isArray(property)) {
      filter = `(${property.map((p) => `${p}:(${searchTerm})`).join('OR+')})`;
    } else {
      filter = `${property}:(${searchTerm})`;
    }

    const url = `${URL}/advancedsearch.php?q=mediatype:(etree)AND+${filter}&${query.join('&')}&${JSONP}`;
    const key = btoa(url);
    if (cache[key]) {
      return Promise.resolve(cache[key]);
    }

    return fetchJsonp(url, {
      timeout: FETCH_TIMEOUT
    })
      .then((response) => response.json())
      .then((response) => response.response.docs)
      .then((data) => {
        cache[key] = data;
        return data;
      });
  },

  advancedSearch({
    artist,
    location,
    song,
    page = 1,
    count = 50,
    orderby = 'publicdate'
  } = {}) {
    const query = [
      'fl[]=avg_rating',
      'fl[]=downloads',
      'fl[]=description',
      'fl[]=coverage',
      'fl[]=creator',
      'fl[]=date',
      'fl[]=identifier',
      'fl[]=title',
      'fl[]=year',
      'fl[]=venue',
      `sort[]=${orderby} desc`,
      'sort[]=',
      'sort[]=',
      `rows=${count}`,
      `page=${page}`
    ];
    const filter = [];

    if (artist) {
      filter.push(`creator:(${artist})`);
    }
    if (location) {
      filter.push(`(venue:(${location})+OR+coverage:(${location}))`);
    }
    if (song) {
      filter.push(`description:(${song})`);
    }

    const url = `${URL}/advancedsearch.php?q=mediatype:(etree)+AND+${filter.join('+AND+')}&${query.join('&')}&${JSONP}`;
    const key = btoa(url);
    if (cache[key]) {
      return Promise.resolve(cache[key]);
    }

    return fetchJsonp(url, {
      timeout: FETCH_TIMEOUT
    })
      .then((response) => response.json())
      .then((response) => response.response.docs)
      .then((data) => {
        cache[key] = data;
        return data;
      });
  }

};
