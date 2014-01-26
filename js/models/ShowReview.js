
define([], function(){

    return ShowReview = function(json){

        var self = this;
        
        if (json === undefined)
            return;

        self.reviewId      = json.review_id;
        self.reviewBody    = json.reviewbody;
        self.reviewDate    = json.reviewdate;
        self.reviewer      = json.reviewer;
        self.reviewTitle   = json.reviewtitle;
        self.stars         = json.stars;
        self.starsHtml     = '';


        var starFull = '<i class="icon-star"></i>';
        var starEmpty = '<i class="icon-star-empty"></i>';
        for (var i=1; i<=self.stars; i++){
            self.starsHtml += starFull;
        }
        for (var i=self.stars; i<5; i++){
            self.starsHtml += starEmpty;
        }
    };
});