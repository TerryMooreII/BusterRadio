


define(['models/Song'], function(Song){

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

        if (json.review !== undefined)
            self.rating     = json.reviews.info.avg_rating ;

        self.artist         = json.metadata.creator[0];
        self.date           = json.metadata.date[0];
        self.description    = json.metadata.description[0];

        if (json.metadata.has_mp3 !== undefined)
            self.hasMP3     = json.metadata.has_mp3[0];
        self.identifier    = json.metadata.identifier[0];

        self.title          = json.metadata.title[0];

        if (json.metadata.venue !== undefined)
            self.venue      = json.metadata.venue[0];

        if (json.metadata.coverage !== undefined)
            self.location   = json.metadata.coverage[0]

        self.year           = json.metadata.year[0];

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