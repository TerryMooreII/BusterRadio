export class Show {

    server: string;
    dir: string;
    identifier: string;
    date: string;
    title: string;
    artist: string;
    description: string;
    lineage: string;
    runtime: string;
    notes: string;
    image: string;
    downloads: string;
    tracks: Array<Track>;
    reviews: Reviews;
    venue: string;
    location: string;

    constructor(json: any) {
        this.server = json.server;
        this.dir = json.dir;
        this.identifier = this.arrayItemExists(json.metadata.identifier);
        this.date = this.arrayItemExists(json.metadata.date);
        this.title = this.arrayItemExists(json.metadata.title);
        this.artist = this.arrayItemExists(json.metadata.creator) || json.misc['collection-title'];
        this.description = this.arrayItemExists(json.metadata.description);
        this.lineage = this.arrayItemExists(json.metadata.lineage);
        this.runtime = this.arrayItemExists(json.metadata.runtime);
        this.notes = this.arrayItemExists(json.metadata.notes);
        this.venue = this.arrayItemExists(json.metadata.venue);
        this.location = this.arrayItemExists(json.metadata.coverage);
        this.image = json.misc.image;
        this.downloads = json.item ? this.arrayItemExists(json.item.downloads) : '0';

        this.tracks = [];

        Object.keys(json.files).forEach((key) => {
            if (key.indexOf('.mp3') > -1) {
                this.tracks.push(new Track(key, this.identifier, json.files[key]));
            }
        });

        if (json.reviews) {
            this.reviews = new Reviews(json.reviews);
        }

    }

    arrayItemExists(data) {
        return data && data[0] ? data[0] : null;
    }
}


export class Track {
    fileName: string;
    track: string;
    title: string;
    time: string;
    creator: string;
    album: string;
    identifier: string;

    constructor(fileName, identifier, json) {
        this.fileName = fileName;
        this.track = json.track;
        this.title = json.title;
        this.time = json.length;
        this.creator = json.creator;
        this.album = json.album;
        this.identifier = identifier;
    }
}

export class Reviews {


    number: number;
    avgRating: string;
    reviews: Array<Review> = [];

    constructor(json) {
        this.number = json.number;
        this.avgRating = json.avgRating;

        json.reviews.forEach(review => {
            this.reviews.push(new Review(review));
        })
    }
}

export class Review {
    body: string;
    title: string;
    reviewer: string;
    date: Date;
    rating: string;

    constructor(json) {
        this.body = json.reviewbody;
        this.title = json.reviewtitle;
        this.reviewer = json.reviewer;
        this.date = new Date(json.reviewdate);
        this.rating = json.stars;
    }

}
