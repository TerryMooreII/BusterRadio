
define(['knockout', 'models/Song'], function(ko, Song){

    return PlaylistItem = function(song){

        var self = this;

        self.hasBeenPlayed = ko.observable(false);
        self.isPlaying = ko.observable(false);
        
        self.song = song;

    };

});