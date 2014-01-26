

define(['knockout'], function(ko){

    return Song = function(json){
        
        var self = this;

        self.album      = '';
        self.bitrate    = '';
        self.creator    = '';
        self.format     = '';
        self.length     = '';
        self.size       = '';
        self.source     = '';
        self.title      = '';
        self.track      = '';
        // self.artist     = '';

        if (json === null || json === undefined)
            return;

        self.album      = json.album;
        self.bitrate    = json.bitrate;
        self.creator    = json.creator;
        self.format     = json.format;
        self.length     = json.length;
        self.size       = json.size;
        self.source     = json.source;
        self.title      = json.title || 'n/a';
        self.track      = json.track;
    };

});
