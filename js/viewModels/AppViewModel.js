

define(['jquery', 'knockout', 'models/Show', 'models/ShowDetails', 'models/PlaylistItem'], function($, ko, Show, ShowDetails, PlaylistItem){

    return AppViewModel = function(){

        //Locals
        var self = this;
        var slider = $('#slider');

        //Observables
        self.searchValue    = ko.observable('');
        self.searchResults  = ko.observableArray([]);
        self.showDetails    = ko.observable(new ShowDetails());
        self.playlist       = ko.observableArray([]);
        self.showPause      = ko.observable(false);
        self.duration       = ko.observable('-0:00')
        var audioElement;
        var playlistPosition = 0;

        self.init = function(){
            console.log('Hello Live Music')
        };


        self.search = function(){  

            self.searchResults([]); //clear previous search 
            var search = self.searchValue().replace(' ', '')
            search.toLowerCase();

            console.log('search: ' + search)
            $.ajax({
                url: 'http://archive.org/advancedsearch.php',
                data: 'q=mediatype:(etree)+AND+collection:(' + search + ')&fl[]=title&fl[]=avg_rating&fl[]=coverage&fl[]=date&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=year&sort[]=date+asc&sort[]=&sort[]=&rows=50&page=1&output=json',
                dataType: 'jsonp',
                type: 'GET',
                beforeSend: function(){

                }

            }).done(function(json){
                $.each(json.response.docs, function(k,v){
                    self.searchResults.push(new Show(v));
                });
            });
        };

        self.getShowDetails = function(show){  

            $.ajax({
                url: 'http://archive.org/details/' + show.identifier,
                data: 'output=json',
                dataType: 'jsonp',
                type: 'GET',
                beforeSend: function(){

                }

            }).done(function(json){
                self.showDetails(new ShowDetails(json));
            });
        }

        self.playSong = function(song){
            var song = 'http://archive.org/download/' + song.identifier +'/' + song.file;
            console.log(song)
            $('#audio').empty();
            $('#audio').html('<audio controls autoplay>'
                                  +   '<source src="' + song  + '" type="audio/mpeg">'
                                  +   'Your browser does not support the audio tag.'
                                  + '</audio>');
        }
        
        self.addToPlaylist = function(song) {
            console.log(song.addSong())
            if (!song.addSong()){
                song.addSong(true);
                self.playlist.push( song ); 
                return true;
            }else{
                self.playlist.remove( song )
                song.addSong(false);
                return false
            }
        };

        
        self.getSongFromPlaylist = function(index){
            
            var sizeOfPlaylist = self.playlist().length;
            
            if (sizeOfPlaylist === 0 || index < 0 || index > sizeOfPlaylist - 1)
                return;
            
            return self.playlist()[index];
        }


        self.play = function(){
            
            if (audioElement === null || audioElement === undefined){
               
                var song = self.getSongFromPlaylist(playlistPosition);
               
                if (song === undefined)
                    return;

                var url = 'http://archive.org/download/' + song.identifier +'/' + song.file;
                
                audioElement = document.createElement('audio');
                audioElement.setAttribute('src', url);
                
                self.getDuration();

            }
            self.showPause(true);
            audioElement.play();
              
        }

        self.pause = function(){
            self.showPause(false);            
            audioElement.pause();
        }

        self.next = function(){
            
            if ( playlistPosition + 1 > self.playlist().length - 1)
                return;
            
            self.pause();
            audioElement = null;
            playlistPosition++;
            self.duration('-0:00');
            self.play();
        }

        self.previous = function(){
            
            if (playlistPosition - 1 < 0)
                return;
            
            self.pause();
            audioElement = null;
            playlistPosition--;
            self.duration('-0:00');
            self.play();
        }

        self.getDuration = function(){
            
            var i = setInterval(function(){
                self.duration('-0:00');
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
                    manualSeek = true;
                },
                stop:function(e,ui) {
                    manualSeek = false;         
                    audioElement.currentTime = ui.value;
                }           
            });


            $(audioElement).bind('timeupdate', function() {
                
              var rem = parseInt(audioElement.duration - audioElement.currentTime, 10),
              pos = (audioElement.currentTime / audioElement.duration) * 100,
              mins = Math.floor(rem/60,10),
              secs = rem - mins*60;
              
              if (isNaN(mins)) { mins = 0 }
              if (isNaN(secs)) { secs = 0 } 

              self.duration('-' + mins + ':' + (secs > 9 ? secs : '0' + secs));
              slider.slider("value", audioElement.currentTime)

            });
        }
    }        
});