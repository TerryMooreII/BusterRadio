define([], function(){

    return ArtistBio = function(json){

        var self = this;
        
        self.name = '';
        self.image = '';
        self.summary = '';
        self.tags = [];
        self.error = '';

        if (json === null || json === undefined)
            return;

        if (json.error){
            self.error = json.message;
            return;
        }
        
        self.name = json.artist.name;
        self.image = json.artist.image[3]['#text'];
        self.summary = json.artist.bio.summary.replace(/<a/g, '<a target="_blank"');

        if (json.artist.tags.tag){
            if ($.isArray(json.artist.tags.tag)){
                $.each(json.artist.tags.tag, function(k, v){
                    self.tags.push(v.name);
                });
            }
            else{
                self.tags.push(json.artist.tags.tag.name)
            }
        }
    };
});