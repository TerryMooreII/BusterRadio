


define(['models/Song', 'models/ShowReview'], function(Song, ShowReview){

    var calcTotalTime = function(time){
        var t = time.split(":");
        var sec = 0;
        if (t.length > 0){
            sec += parseInt(t[0], 10) * 60;
            sec += parseInt(t[1]);
        }
        return sec;
    };

    var secondsToMinutes = function(time){
        var hours = Math.floor(time / 3600);
        time = time - hours * 3600;
        var min = Math.floor(time/60);
        var sec = time - min * 60;
        return addLeadingZero(hours) + ":" + addLeadingZero(min) + ":" + addLeadingZero(sec);
    };

    var addLeadingZero = function(time){
        return (time <= 9 ? "0" + time : time);
    };

    return ShowDetails = function(json){

        var self = this;
        self.songs = [];

        if (json === undefined)
            return;

        
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
        var i=0;
        for (i=1; i<=self.stars; i++){
            self.starsHtml += starFull;
        }
        if ( self.stars % 1 >= .5){
            self.starsHtml += starHalf;
            i++;
        }
        for (i; i<=5; i++){
            self.starsHtml += starEmpty;
        }

        if (json.metadata !== undefined){
            self.artist         = json.metadata.creator ? json.metadata.creator[0] : '';
            self.date           = json.metadata.date ? json.metadata.date[0] : '';
            self.description    = json.metadata.description ? json.metadata.description[0] : '';
            self.hasMP3         = json.metadata.has_mp3 ? json.metadata.has_mp3[0] : '';
            self.identifier     = json.metadata.identifier ? json.metadata.identifier[0] : '';
            self.title          = json.metadata.title ? json.metadata.title[0] : '';
            self.venue          = json.metadata.venue ? json.metadata.venue[0] : '';
            self.location       = json.metadata.coverage ? json.metadata.coverage[0] : '';
            self.year           = json.metadata.year? json.metadata.year[0] : '';
            self.lineage        = json.metadata.lineage ? json.metadata.lineage[0]:'';
            self.source         = json.metadata.source ? json.metadata.source[0] : '';
        }

        self.songs = [];
        var totalLength = 0;
        if (json.files !== undefined) {
            $.each(json.files, function(k,v){
                if (v.format.toUpperCase() === "VBR MP3"){
                    var song = new Song(v);
                    song.file = k;
                    song.identifier = self.identifier;
                    self.songs.push(song);
                    if (song.length)
                        totalLength += calcTotalTime(song.length);
                }
            });
        }

        self.totalLength = secondsToMinutes(parseInt(totalLength));

    }; //end return

});