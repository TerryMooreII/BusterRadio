
define([], function(){

    return Show = function(json){

        var self = this;

        self.vg_rating = json.vg_rating;
        //coverage: Array[1]
        self.date = json.date.substring(0,10);
        self.description = json.description;
        self.downloads = json.downloads;
        self.identifier =  json.identifier;
        self.mediatype = json.mediatype;
        self.title = json.title;
        self.year = json.year;

        var re = new RegExp("\\at\\s(.*?)\\son");

        var res = re.exec(json.title)
        self.venue = (res !== null) ? res[1] : 'Unknown';
        
    };

});