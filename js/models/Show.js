
define([], function(){

    return Show = function(json){

        var self = this;

        self.vg_rating = json.vg_rating;
        //coverage: Array[1]
        self.date = json.date;
        self.description = json.description;
        self.downloads = json.downloads;
        self.identifier =  json.identifier;
        self.mediatype = json.mediatype;
        self.title = json.title;
        self.year = json.year;

    };

});