
define(['jquery', 'knockout', 'sammyjs', 'models/Show', 'models/ShowDetails', 'models/PlaylistItem', 'models/Song'], function($, ko, Sammy, Show, ShowDetails, PlaylistItem, Song){

    return AppViewModel = function(){

        //Locals
        var self = this;
        var slider = $('#slider');

        //Observables
        self.searchValue    = ko.observable('');
        self.searchResults  = ko.observableArray([]);
        self.searchResultsByYear = ko.observableArray([]);
        self.showDetails    = ko.observable(new ShowDetails());
        self.playlist       = ko.observableArray([]);
        self.showPause      = ko.observable(false);
        self.duration       = ko.observable('0:00');
        self.timeLeft       = ko.observable('-0:00');
        self.songLength     = ko.observable('0:00');
        self.currentSong    = ko.observable(new Song());
        self.showMute       = ko.observable(false);
        var audioElement;
        var playlistPosition = 0;
        var playlistItemPrevious = 0;
        var volumeState = 1;
        var xhr = null;
        self.init = function(){
            self.checkForHTML5Audio();
        };

        self.checkForHTML5Audio = function(){
            if(!document.createElement('audio').canPlayType){
                alert('Your browser doesn\'t support the HTML5 audio tag. \n\n Get a better browser like Google Chrome. \n\n Also I need a better error message' );
                window.location = 'http://google.com/chrome';
            }
        }

        self.setSearchHash = function(){
            var search = self.searchValue().replace(/ /gi, '');
            search.toLowerCase();
                
            location.hash = search;
        }


        self.setShowDetailsHash = function(show){
            var artist = (location.hash.indexOf('/') === -1) ? 1000 :  location.hash.indexOf('/')
            location.hash = location.hash.substring(1, artist) +'/'+ show.identifier
        }


        self.search = function(search){  

            if ($('.listDisplay').hasClass('ui-accordion'))
                $( "#accordion" ).accordion('destroy');
            
            if (xhr)
                xhr.abort();

            xhr = $.ajax({
                url: 'http://archive.org/advancedsearch.php',
                data: 'q=mediatype:(etree)+AND+collection:(' + search + ')&fl[]=title&fl[]=avg_rating&fl[]=coverage&fl[]=date&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=year&sort[]=date+asc&sort[]=&sort[]=&rows=15000&page=1&output=json',
                dataType: 'jsonp',
                type: 'GET',
                beforeSend: function(){
                    console.log('Loading...');
                    $('.loading').find('span').text('Loading...');
                    $('.loading').show();
                }
            }).done(function(json){
                console.log('Begin parse')
                $('.loading').find('span').text('Parsing...')
                var year = 0;
                var flat = []
                var byYear = {};
                var shows = [];
                byYear.shows = [];
                var tot = [];
                
                $.each(json.response.docs, function(k,v){
                    //flat.push(new Show(v));
                    
                    if ( year !== v.year ){
                    
                        if (byYear.shows.length > 0){
                            self.searchResultsByYear.push(byYear);
                            byYear = {};
                            byYear.shows = [];
                        }
                        year = v.year;
                        byYear.year = year;

                    }
                    byYear.shows.push(new Show(v));
                    
                });
                
                self.searchResultsByYear.push(byYear);
                
                //self.searchResults(flat);
                
                $( "#accordion" ).accordion({
                  heightStyle: "content",
                  collapsible: true 
                });
                
                $('.loading').hide();
                xhr = null;
                console.log('done')
            });
        };

        self.getShowDetails = function(identifier){  

            $.ajax({
                url: 'http://archive.org/details/' + identifier,
                data: 'output=json',
                dataType: 'jsonp',
                type: 'GET',
                beforeSend: function(){
                    console.log('finding show...')
                }

            }).done(function(json){
                console.log(json)
                self.showDetails(new ShowDetails(json));
            });
        }
        // no longer used.  This would play a single song with native chrome audio player
        //below we create our own
        self.playSong = function(song){
            var song = 'http://archive.org/download/' + song.identifier +'/' + song.file;
            $('#audio').empty();
            $('#audio').html('<audio controls autoplay>'
                                  +   '<source src="' + song  + '" type="audio/mpeg">'
                                  +   'Your browser does not support the audio tag.'
                                  + '</audio>');
        }
        
        self.addToPlaylist = function(song) {
            $('#myTab a[href="#playlists"]').tab('show');
            self.playlist.push( new PlaylistItem(song) ); 
        };
        
        self.addAll = function(){
            $.each(self.showDetails().songs, function(index, song){
                self.addToPlaylist(song);
            });
        };

        self.removeFromPlaylist = function(data, event){
            self.playlist.remove(data);
        };

        self.removeAllFromPlaylist = function(data, event){
            self.playlist([]);
        };

        self.playSongFromPlaylist = function(playlistItem){
            var index = self.playlist.indexOf(playlistItem);
            playlistPosition = index;
            if (audioElement)
                self.pause();
            audioElement = null;
            self.resetTime();
            self.play();
        }

        self.play = function(){
            
            if (audioElement === null || audioElement === undefined){
                
                //reset isPlaying to false for previous song
                if (self.playlist.indexOf(playlistItemPrevious) !== -1)
                    self.playlist()[self.playlist.indexOf(playlistItemPrevious)].isPlaying(false);
                                

                //playListPlayingIndex = self.getSongFromPlaylist(playlistPosition);
                                
                playlistItem = self.playlist()[playlistPosition];
                console.log(playlistItem)
                playlistItemPrevious = playlistItem;
                var url = 'http://archive.org/download/' + playlistItem.song.identifier +'/' + playlistItem.song.file;

                playlistItem.isPlaying(true);
                
                self.currentSong(playlistItem.song)
                
                audioElement = document.createElement('audio');
                audioElement.setAttribute('src', url);
                
                self.getDuration(); //sets the time and binds the slider 
                self.onSongEnd();
                audioElement.volume = volumeState;
            }
            self.showPause(true);
            audioElement.play();
              
        }

        self.pause = function(){
            self.showPause(false);            
            audioElement.pause();
        }

        self.resetTime = function(){

            self.duration('0:00');
            self.timeLeft('-0:00');
            self.songLength('0:00');
        }

        self.next = function(){
            
            if ( playlistPosition + 1 > self.playlist().length - 1)
                return;
            
            self.pause();
            audioElement = null;
            playlistPosition++;
            self.resetTime();
            self.play();
        }

        self.previous = function(){
            
            if (playlistPosition - 1 < 0)
                return;
            
            self.pause();
            audioElement = null;
            playlistPosition--;
            self.resetTime();
            self.play();
        }

        self.getDuration = function(){
            
            var i = setInterval(function(){
                self.resetTime();
                if (audioElement.readyState > 0) {
                
                    var duration = Math.round(audioElement.duration);
                   
                    if (duration){
                        clearInterval(i);
                        self.updateSlider();
                    }
                }
            },500);
        };

        self.updateSlider = function(){
            
            slider.slider({
                value: 0,
                step: 0.01,
                orientation: "horizontal",
                range: "max",
                max: audioElement.duration,
                animate: true,          
                slide: function() {             
                    
                },
                stop:function(e,ui) {         
                    audioElement.currentTime = ui.value;
                }           
            });
            self.bindTimeUpdateToSlider();
        };

        self.bindTimeUpdateToSlider = function(){

            $(audioElement).on('timeupdate', function() {
                //commented items are for count down
                //var rem = parseInt(audioElement.duration - audioElement.currentTime, 10);
                //var mins = Math.floor(rem/60,10);
                //var secs = rem - mins*60;

                var len = parseInt(audioElement.duration, 10);
                var lenMins = Math.floor(len/60, 10);
                var lenSecs = len - lenMins * 60;


                var dur = parseInt(audioElement.currentTime, 10);
                var durMins = Math.floor(dur/60, 10);
                var durSecs = dur -durMins * 60;

                if (isNaN(durMins)) { durMins = 0 }
                if (isNaN(durSecs)) { durSecs = 0 } 
                if (isNaN(lenMins)) { lenMins = 0 }
                if (isNaN(lenSecs)) { lenSecs = 0 } 
                
                //if (isNaN(mins)) { mins = 0 }
                //if (isNaN(secs)) { secs = 0 } 

                self.duration(durMins + ':' + (durSecs > 9 ? durSecs : '0' + durSecs));
                //self.timeLeft('-' + mins + ':' + (secs > 9 ? secs : '0' + secs));
                self.songLength(lenMins + ':' + (lenSecs > 9 ? lenSecs : '0' + lenSecs))
                slider.slider("value", audioElement.currentTime)

            });
        };

        self.onSongEnd = function(){
            $(audioElement).on('ended', function(){
                self.next();
            });
        };

        self.volumeControl = function(){
            if (audioElement === null || audioElement === undefined)
                return true
            
            if (audioElement.volume === 0 ){
                audioElement.volume = 1;
                volumeState = 1;
                self.showMute(false)
            }else{
                audioElement.volume = 0;
                volumeState = 0;
                self.showMute(true);
            }
        }
        
        // Client-side routes    
        Sammy(function() {
            this.get('#:artist', function() {   
                self.searchResults([]); //clear previous search 
                self.searchResultsByYear([]);
                
                self.searchValue(this.params.artist)
                self.search(this.params.artist);    
            });

            this.get('#:artist/:show', function() {   
                //if loading from scratch then load both show list and details
                if (self.searchValue() === '' || self.searchValue === undefined){
                    self.search(this.params.artist)
                    self.searchValue(this.params.artist)
                }

                self.getShowDetails(this.params.show)    
            });

            this.get('', function() {
                //do this when there isnt a hash tag
            });

        }).run();

    }        


});


































