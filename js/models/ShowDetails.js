


define(['models/Song', 'models/ShowReview'], function(Song, ShowReview){

    return ShowDetails = function(json){

        var self = this;
        self.songs = [];

        if (json === undefined)
            return

        
        self.dir            = json.dir;
        self.server         = json.server;
        self.downloads      = json.item.downloads;
        self.headerImage    = json.misc.header_image;
        self.image          = json.misc.image;

        if (json.reviews !== undefined){
            self.stars     = json.reviews.info.avg_rating;
            self.numReviews = json.reviews.info.num_reviews;
            
            self.reviews = [];
            if (json.reviews.reviews !== undefined){
                $.each(json.reviews.reviews, function(k,v){
                    self.reviews.push(new ShowReview(v));
                });
            }        

        }

        self.starsHtml = '';
        var starFull = '<i class="icon-star"></i>';
        var starEmpty = '<i class="icon-star-empty"></i>';
        var starHalf = '<i class="icon-star-half"></i>';
        var i;
        for (i=1; i<=self.stars; i++){
            self.starsHtml += starFull;
        }
        if ( self.stars % 1 >= .5){
            self.starsHtml += starHalf;
            i++;            
        }
        for (i; i<5; i++){
            self.starsHtml += starEmpty;
        }

        if (json.metadata !== undefined){        
            self.artist         = json.metadata.creator[0];
            self.date           = json.metadata.date[0];
            self.description    = json.metadata.description[0];
            //self.hasMP3         = json.metadata.has_mp3[0];
            self.identifier     = json.metadata.identifier[0];
            self.title          = json.metadata.title[0];
            self.venue          = json.metadata.venue[0];
            self.location       = json.metadata.coverage[0]
            self.year           = json.metadata.year[0];
            self.lineage        = json.metadata.lineage[0];
            self.source         = json.metadata.source[0];
        }

        self.songs = [];
        if (json.files !== undefined) {
            $.each(json.files, function(k,v){
                if (v.format.toUpperCase() === "VBR MP3"){
                    var song = new Song(v);
                    song.file = k;
                    song.identifier = self.identifier;
                    self.songs.push(song);
                }
            });
        }

    };

});