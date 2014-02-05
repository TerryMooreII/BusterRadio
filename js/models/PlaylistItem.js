
define(['knockout', 'models/Song'], function(ko, Song){

    return PlaylistItem = function(song){

        var self = this;

        self.hasBeenPlayed = ko.observable(song.hasBeenPlayed || false);
        self.isPlaying = ko.observable(false);


        if (song.song)
        	self.song = new Song(song.song);
        else 
        	self.song = new Song(song)
    };

});