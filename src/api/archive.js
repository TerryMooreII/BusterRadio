import axios from 'axios-jsonp-pro';

const URL = 'https://archive.org';
const JSONP = 'callback=callback&save=yes&output=json';
const COLLECTION_AND_MEDIATYPE = '/advancedsearch.php?q=mediatype%3Acollection+AND+collection%3Aetree&';
const COLLECTION = '/advancedsearch.php?q=collection%3Aetree&';


const createApi = query => `${URL}${COLLECTION}${query.join('&')}&${JSONP}`;

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
  sanitize = (item) => {
    return item && Array.isArray(item) && item.length > 0 ? item[0] : null;
  };

  getImages = files => Object.keys(files).filter(file => file.endsWith('.jpg'));
  getTracks = (files) => {
    const tracks = {};
    const trackTypes = ['mp3', 'flac', 'ogg'];
    trackTypes.forEach((trackType) => {
      tracks[trackType] = Object.keys(files)
        .filter(file => file.endsWith(trackType) === true)
        .map(file => Object.assign(files[file], {
          file,
          server: this.server,
          artist: this.artist,
          dir: this.dir
        }));
    });
    return tracks;
  }
}

export default {
  trackUrl({ server, dir, file }){
    console.log({ server, dir, file });
    const a = `//${server}${dir}/${file}`;
    console.log(a);
    return a;
  },
  getAllArtists() {
    const query = [
      'fl[]=identifier',
      'fl[]=title',
      'sort[]=titleSorter+asc',
      'rows=10000',
      'page=1'];

    return axios.jsonp(`${URL}${COLLECTION_AND_MEDIATYPE}${query.join('&')}&${JSONP}`)
      .then(response => response.response.docs);
  },
  getLatestShows() {
    const query = [
      'fl[]=avg_rating',
      'fl[]=collection',
      'fl[]=coverage',
      'fl[]=creator',
      'fl[]=date',
      'fl[]=identifier',
      'fl[]=title',
      'fl[]=year',
      'fl[]=venue',
      'sort[]=publicdate desc',
      'sort[]=',
      'sort[]=',
      'rows=32',
      'page=1'
    ];

    return axios.jsonp(createApi(query))
      .then(response => response.response.docs);
  },
  getShow(id) {
    return axios.jsonp(`${URL}/details/${id}?${JSONP}`)
      .then(response => new Show(response));
  },
  getMediaUrl(dir, file) {
    return `//www.archive.org/download/${dir}/${file}`;
  },
  getShows(artistId, year){
    const query = [
      //'fl[]=title',
      'fl[]=avg_rating',
      'fl[]=coverage',
      'fl[]=date',
      //'fl[]=description',
      'fl[]=downloads',
      'fl[]=identifier',
      'fl[]=venue',
      'fl[]=year',
      'sort[]=year+desc',
      'desc[]=',
      'sort[]=',
      'rows=15000',
      'page=1'
    ];
    const url = `${URL}/advancedsearch.php?q=mediatype:(etree)+AND+collection:(${artistId})+AND+year:(${year})&${query.join('&')}&${JSONP}`;
    return axios.jsonp(url)
      .then(response => response.response.docs)
      .then(shows => {
        const grouped = {};
        shows.sort((a, b) => new Date(a.date) - new Date(b.date));
        shows.forEach(show => {
          if(!grouped[show.date]) {
            grouped[show.date] = Object.assign(show, {count: 1});
          } else if (grouped[show.date] && (show.avg_rating > grouped[show.date].avg_rating) || !grouped[show.date].avg_rating)  {
            const count = grouped[show.date].count++;
            grouped[show.date] = Object.assign(show, {count});
          } else {
            grouped[show.date].count++;
          }
        });
        return grouped;
      });
  },
  getShowsByDate(artistId, date) {
    const query = [
      //'fl[]=source',
      'fl[]=avg_rating',
      'fl[]=coverage',
      'fl[]=date',
      //'fl[]=description',
      'fl[]=downloads',
      'fl[]=identifier',
      'fl[]=venue',
      'fl[]=year',
      'sort[]=avg_rating+desc',
      'desc[]=',
      'sort[]=',
      'rows=15000',
      'page=1'
    ];
    const url = `${URL}/advancedsearch.php?q=mediatype:(etree)+AND+collection:(${artistId})+AND+date:(${date})&${query.join('&')}&${JSONP}`;
    console.log(url);
    return axios.jsonp(url)
      .then(response => response.response.docs);
      
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
    return axios.jsonp(url)
      .then(response => response.response.docs)
      .then(response => {
        const obj = {};
        response.forEach(show => {
          if(obj[show.year]){
            obj[show.year].push(show.date);
          }else {
            obj[show.year] = [show.date];
          }
        });

        const ret = [];
        Object.keys(obj).forEach(year => {
          const total = Array.from(new Set(obj[year])).length
          obj[year] = total
          ret.push({
            year, total
          })
        })
        return ret.sort((a, b) => a.year - b.year );
      });
  }
};

