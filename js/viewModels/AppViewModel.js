
define(['jquery', 'knockout', 'sammyjs', 'models/Show', 'models/ShowDetails', 'models/PlaylistItem', 'models/Song'], 
    function($, ko, Sammy, Show, ShowDetails, PlaylistItem, Song){
 
    return AppViewModel = function(){
        //Locals
        var self = this;
        var slider = $('#slider');
        var audioElement;
        var playlistPosition = 0;
        var playlistItemPrevious = 0;
        var volumeState = 1;
        var xhr = null;
        var apiHostname = 'http://www.archive.org/';
        var allArtistsList = [];

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
        self.alphabet       = ko.observableArray('ABCDEFGHIJKLMNOPQURSTUVWXWYZ'.split(''));
        self.alphabet.push('Other');
        self.artistsStartingWith = ko.observable('');
        self.allArtistStartingWith = ko.observableArray([]);
        self.favoriteShows  = ko.observableArray([]);
        self.artistName = ko.observable('');

        self.init = function(){
            self.checkForHTML5Audio();
            self.populateFavoriteShows();
            self.bindKeycodes();
            self.populateAllArtistsList(function(){
                routes();
            });
        };

        self.checkForHTML5Audio = function(){
            if(!document.createElement('audio').canPlayType){
                alert('Your browser doesn\'t support the HTML5 audio tag. \n\n Get a better browser like Google Chrome. \n\n Also I need a better error message' );
                window.location = 'http://google.com/chrome';
            }
        };

        self.setSearchHash = function(){
            var search = self.searchValue().replace(/ /gi, '');
            search.toLowerCase();
                
            location.hash = search;
        };

        self.setArtistHash = function(data, event){
            
            self.artistName(data.title);
            var search = data.identifier.replace(/ /gi, '');
            search.toLowerCase();
                
            location.hash = search;
        };

        self.setShowDetailsHash = function(show){
            console.log('show...details')
            console.log(show)
            var artist = (location.hash.indexOf('/') === -1) ? 1000 :  location.hash.indexOf('/');
            location.hash = location.hash.substring(1, artist) +'/'+ show.identifier;
        };

        self.populateAllArtistsList = function(callback){
            
            $.ajax({
                url: apiHostname + 'advancedsearch.php?q=mediatype%3Acollection+AND+collection%3Aetree&fl[]=identifier&fl[]=title&sort[]=titleSorter+asc&sort[]=&sort[]=&rows=10000&page=1&callback=callback&save=yes&output=json',
                dataType: 'jsonp',
                type: 'GET',
                beforeSend: function(){
                    $('#wrapper').css('opacity', '.3');
                    $('#loading').show();
                }
            }).done(function(json){
                $.each(json.response.docs, function(k,v){
                    allArtistsList.push(v);
                });
                $('#wrapper').css('opacity', '1');
                $('#loading').hide();
                callback();
            });

        };

        self.getRandomArtist = function(){
            var i = Math.floor(Math.random() * allArtistsList.length);
            location.hash = allArtistsList[i].identifier;
        };

        self.getArtistStartingWith = function(){
        
            var temp = [];
            for (var i=0; i<allArtistsList.length; i++){
                if (self.artistsStartingWith() === 'Other'){
                    if ( self.alphabet.indexOf(allArtistsList[i].title.substring(0,1).toUpperCase()) === -1)
                        temp.push(allArtistsList[i]);
                }else if (allArtistsList[i].title.substring(0,1).toUpperCase() ===  self.artistsStartingWith() ){
                    temp.push(allArtistsList[i]);
                }
            }
            
            self.allArtistStartingWith(temp);
            $('.sideBarListArtists').scrollTop(0);
        };

        self.getAutocompleteArtists = function(request, response){

            var filtered = allArtistsList.filter(function(el){
                return el.title.toLowerCase().indexOf(request.term.toLowerCase()) !== -1;
            })
            return response( $.map( filtered, function( item ) {
                        return {
                            label: item.title,
                            value: item.title,
                            hash: item.identifier
                        };
                    }));
        };

        self.search = function(search){

            if ($('.listDisplay').hasClass('ui-accordion'))
                $( '#accordion' ).accordion('destroy');
            
            if (xhr)
                xhr.abort();

            $('#myTab a[href="#search"]').tab('show');

            xhr = $.ajax({
                url: apiHostname + 'advancedsearch.php',
                data: 'q=mediatype:(etree)+AND+collection:(' + search + ')&fl[]=title&fl[]=avg_rating&fl[]=coverage&fl[]=date&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=year&sort[]=date+asc&sort[]=&sort[]=&rows=15000&page=1&output=json',
                dataType: 'jsonp',
                type: 'GET',
                beforeSend: function(){
                    $('.loading').find('span').text('Loading...');
                    $('.loading').show();
                }
            }).done(function(json){
                $('.loading').find('span').text('Parsing...');
                var year = 0;
                var flat = [];
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
                
                $( '#accordion' ).accordion({
                  heightStyle: 'content',
                  collapsible: true
                });
                
                $('.loading').hide();
                xhr = null;
                
            });
        };

        self.getShowDetails = function(identifier){

            $.ajax({
                url: apiHostname + 'details/' + identifier,
                data: 'output=json',
                dataType: 'jsonp',
                type: 'GET',
                beforeSend: function(){
                    console.log('finding show...');
                }

            }).done(function(json){
                $('showSongList').show();
                self.showDetails(new ShowDetails(json));

            });
        };

        //***************************************
        //          Playlist controls
        //***************************************
        
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
        };

        // Play single song from show list
        // self.playSong = function(song){
        //    self.addToPlaylist(song);
        // };

        //***************************************
        //          Music Controls
        //***************************************
        
        self.bindKeycodes = function(){

            $('body').on('keyup', function(e){
                if (e.target.tagName.toUpperCase() === 'INPUT') return;
                
                if ( (e.ctrlKey && e.keyCode === 32) || e.keyCode === 80 ){ //'p' or ctrl+space
                    if (self.showPause())
                        self.pause();
                    else
                        self.play();
                }

                if ( (e.ctrlKey && e.keyCode === 39) || e.keyCode === 78) //'ctrl+-> or n'
                    self.next();
                
                if ( (e.ctrlKey && e.keyCode === 37) || e.keyCode === 66) //'ctrl+<- or b'
                    self.previous();

                if (e.keyCode === 77) //'m'
                    self.volumeControl();

            });
        };

        self.play = function(){
            
            if (self.playlist().length === 0)
                return;

            if (audioElement === null || audioElement === undefined){
                
                //reset isPlaying to false for previous song
                if (self.playlist.indexOf(playlistItemPrevious) !== -1)
                    self.playlist()[self.playlist.indexOf(playlistItemPrevious)].isPlaying(false);
                                

                //playListPlayingIndex = self.getSongFromPlaylist(playlistPosition);
                                
                playlistItem = self.playlist()[playlistPosition];
                console.log(playlistItem);
                playlistItemPrevious = playlistItem;
                var url = apiHostname + 'download/' + playlistItem.song.identifier +'/' + playlistItem.song.file;

                playlistItem.isPlaying(true);
                
                self.currentSong(playlistItem.song);
                console.log(self.currentSong())
                audioElement = document.createElement('audio');
                audioElement.setAttribute('src', url);
                
                self.getDuration(); //sets the time and binds the slider 
                self.onSongEnd();
                //this is a test of these binds
                $(audioElement).on('waiting', function(e){
                    console.debug('Audio has triggered the onwaiting event');
                    console.debug(e);
                });
                $(audioElement).on('suspend', function(e){
                    //console.debug('Audio has triggered the onsuspend event');
                    //console.debug(e);
                });
                $(audioElement).on('stalled', function(e){
                    console.debug('Audio has triggered the onstalled event');
                    console.debug(e);
                });
                $(audioElement).on('error', function(e){
                    console.debug('Audio has triggered the onerror event');
                    console.debug(e);
                });
                $(audioElement).on('emptied', function(e){
                    console.debug('Audio has triggered the onemptied event');
                    console.debug(e);
                });

                $(audioElement).on('canplay', function(e){
                    console.log('canplay')
                    //ENABLE THE AWESOME BARS!!!!
                    bars(audioElement);                     
                });
                //End test
                audioElement.volume = volumeState;
            }
            self.showPause(true);
            audioElement.play();
            
        };

        self.pause = function(){
            self.showPause(false);
            audioElement.pause();
        };

        self.resetTime = function(){

            self.duration('0:00');
            self.timeLeft('-0:00');
            self.songLength('0:00');
        };

        self.next = function(){
            
            if ( playlistPosition + 1 > self.playlist().length - 1)
                return;
            
            self.pause();
            audioElement = null;
            playlistPosition++;
            self.resetTime();
            self.play();
        };

        self.previous = function(){
            
            if (playlistPosition - 1 < 0)
                return;
            
            self.pause();
            audioElement = null;
            playlistPosition--;
            self.resetTime();
            self.play();
        };

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
                orientation: 'horizontal',
                range: 'max',
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

                if (isNaN(durMins)) { durMins = 0; }
                if (isNaN(durSecs)) { durSecs = 0; }
                if (isNaN(lenMins)) { lenMins = 0; }
                if (isNaN(lenSecs)) { lenSecs = 0; }
                
                //if (isNaN(mins)) { mins = 0 }
                //if (isNaN(secs)) { secs = 0 } 

                self.duration(durMins + ':' + (durSecs > 9 ? durSecs : '0' + durSecs));
                //self.timeLeft('-' + mins + ':' + (secs > 9 ? secs : '0' + secs));
                self.songLength(lenMins + ':' + (lenSecs > 9 ? lenSecs : '0' + lenSecs));
                slider.slider('value', audioElement.currentTime);

            });
        };

        self.onSongEnd = function(){
            $(audioElement).on('ended', function(){
                self.next();
            });
        };

        self.volumeControl = function(){
            if (audioElement === null || audioElement === undefined)
                return true;
            
            if (audioElement.volume === 0 ){
                audioElement.volume = 1;
                volumeState = 1;
                self.showMute(false);
            }else{
                audioElement.volume = 0;
                volumeState = 0;
                self.showMute(true);
            }
        };
        
        //***************************************
        //        Client Side Routes
        //***************************************
        
        var getArtistNameFromHash = function(hash){

            $.each(allArtistsList,  function(k,v){
                if(v.identifier.toLowerCase() === hash.toLowerCase()){
                    self.artistName(v.title);
                    return false;
                }
            });
        }

        var routes = function(){
            
            Sammy(function() {

                this.get('#:artist', function() {
                    self.searchResults([]); //clear previous search 
                    self.searchResultsByYear([]);
                    getArtistNameFromHash(this.params.artist);
                    self.search(this.params.artist);
                });

                this.get('#:artist/:show', function() {
                    //if loading from scratch then load both show list and details
                    if (self.artistName() === '' || self.artistName === undefined ){
                        self.search(this.params.artist);
                        getArtistNameFromHash(this.params.artist);
                        
                    }

                    self.getShowDetails(this.params.show);
                });

                this.get('', function() {
                    //do this when there isnt a hash tag
                });

            }).run();

        }

        //***************************************
        //      Storage Function
        //***************************************
        
        self.addShowToFavorites = function(){
            var hash = window.location.hash.split('/');
            if (localStorage.favorites){
                var favorites = JSON.parse(localStorage.favorites);
                
            }else{
                var favorites = {};
                    favorites.shows = [];
                                }
            var details = ko.toJS(self.showDetails);
            self.favoriteShows.push(details)

            favorites.shows.push(details);
            localStorage.favorites = JSON.stringify(favorites);
        };

        self.removeShowFromFavorites = function(index){
            if (!localStorage.favorites)
                return;

            var favorites = JSON.parse(localStorage.favorites);
            self.favoriteShows.splice(index, 1);
            favorites.shows.splice(index, 1);
            localStorage.favorites = JSON.stringify(favorites);
        };

        self.viewFavoriteShow = function(data, event){
            window.location.hash = data.artist.replace(/ /gi, '') + '/' + data.identifier;
        };

        self.populateFavoriteShows = function(){
            if (localStorage.favorites){
                var obj = JSON.parse(localStorage.favorites);
                $.each(obj.shows, function(k,v){
                    self.favoriteShows.push(v);
                });
            }
        };


        //THis is copy and pasted with very little modification.
        //Needs cleaned up
        //http://html5-demos.appspot.com/static/webaudio/createMediaSourceElement.html
        var bars = function(audioElement) {
            var canvas = document.getElementById('fft');
            var ctx = canvas.getContext('2d');
            canvas.width = document.body.clientWidth / 1.4;

            $('#fft').on('click', function(){
                $(this).hide();
            })

            const CANVAS_HEIGHT = canvas.height;
            const CANVAS_WIDTH = canvas.width;

            // Check for non Web Audio API browsers.
            if (!window.webkitAudioContext) {
              alert("Web Audio isn't available in your browser. But...you can still play the HTML5 audio :)");
              return;
            }
            var context = null;
            var context = new webkitAudioContext();
            var analyser = context.createAnalyser();

            function rafCallback(time) {
                window.webkitRequestAnimationFrame(rafCallback, canvas);

                var freqByteData = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(freqByteData); //analyser.getByteTimeDomainData(freqByteData);

                var SPACER_WIDTH = 10;
                var BAR_WIDTH = 5;
                var OFFSET = 100;
                var CUTOFF = 23;
                var numBars = Math.round(CANVAS_WIDTH / SPACER_WIDTH);

                ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                //   var gradient = ctx.createLinearGradient(0,0,0,canvas.height);
                //     gradient.addColorStop(1,'#000000');
                //     gradient.addColorStop(0.75,'#ff0000');
                //     gradient.addColorStop(0.25,'#ffff00');
                //     gradient.addColorStop(0,'#ffff00');

                var gradient = ctx.createLinearGradient(0,0,0,canvas.height);
                gradient.addColorStop(1,'#8cc84b');
                 gradient.addColorStop(0.50,'#453');
                gradient.addColorStop(0,'#453');

                ctx.fillStyle = gradient;  

                //ctx.fillStyle = '#8cc84b';
                ctx.lineCap = 'round';

                // Draw rectangle for each frequency bin.
                for (var i = 0; i < numBars; ++i) {
                    var magnitude = freqByteData[i + OFFSET] / 2;
                    ctx.fillRect(i * SPACER_WIDTH, CANVAS_HEIGHT, BAR_WIDTH, -magnitude);
                    //ctx.fillStyle = magnitude < 26 ? '#453' : '#8cc84b';
                }
            }

            var source = context.createMediaElementSource(audioElement);
            source.connect(analyser);
            analyser.connect(context.destination);

            rafCallback();
        };
     };

});

