
define(['models/Song'], function(Song){

    return PlaylistItem = function(json){

        var self = this;

        self.song = json.song;
        self.hasBeenPlayed = json.hasBeenPlayed;

    };

});