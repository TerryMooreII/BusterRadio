export class Show {

    server: String;
    dir: String;
    identifier: String;
    date: String;
    title: String;
    artist: String;
    description: String;
    lineage: String;
    runtime: String;
    notes: String;
    image: String;
    downloads: String;
    tracks:Array<Track>;
    reviews:Reviews;
    venue:String;
    location:String;

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
        this.downloads = this.arrayItemExists(json.item.downloads);

        this.tracks = [];

        Object.keys(json.files).forEach((key) => {
            if (key.indexOf('.mp3') > -1){
                this.tracks.push(new Track(key, this.identifier, json.files[key]));
            }
        });

        if (json.reviews){
            this.reviews = new Reviews(json.reviews);
        }

    }

    arrayItemExists(data){
        return data && data[0] ? data[0] : null;
    }
}


export class Track {
    fileName: String;
    track: String;
    title: String;
    time:String;
    creator:String;
    album:String;
    identifier:String;

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


    number:number;
    avgRating:String;
    reviews:Array<Review> = [];

    constructor(json) {
        this.number = json.number;
        this.avgRating = json.avgRating;

        json.reviews.forEach(review =>{
            this.reviews.push(new Review(review));
        })
    }
}

export class Review {
    body:String;
    title:String;
    reviewer:String;
    date:Date;
    rating:String;

    constructor (json){
        this.body = json.reviewbody;
        this.title = json.reviewtitle;
        this.reviewer = json.reviewer;
        this.date = new Date(json.reviewdate);
        this.rating = json.stars;
    }

}
