
define(['jquery', 'knockout', 'sammyjs', 'underscorejs', 'models/Show', 'models/ShowDetails', 'models/PlaylistItem', 'models/Song', 'models/ArtistBio'], 
    function($, ko, Sammy, _, Show, ShowDetails, PlaylistItem, Song, ArtistBio){
 
    return AppViewModel = function(){
        //Locals
        var self = this;
        var LASTFM_API_URL = 'http://ws.audioscrobbler.com/2.0/';
        var LASTFM_API_KEY = '748badaa2ec79b0d485e1b7c7a88af96';
        var ARCHIVE_ORG_API_URL = 'http://www.archive.org/';
        var slider = $('#slider');
        var volumeSlider = $('#volume-slider');
        var audioElement;
        var playlistPosition = 0;
        var playlistItemPrevious = 0;
        var volumeState = 1;
        var xhr = null;
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
        self.artistBio = ko.observable('');
        self.latestShows = ko.observableArray([]);
        self.enableNotifications = ko.observable(localStorage.getItem('enableNotifications') ||"No");
        self.enableDancingBars = ko.observable(localStorage.getItem('enableDancingBars') ||"No");

        
        self.init = function(){
            self.checkForHTML5Audio();
            self.populateFavoriteShows();
            self.bindKeycodes();
            self.populateAllArtistsList(function(){
                routes();
            });
            //Load playlist from localstorage
            self.playlist(getSavedPlaylistsCache());
        };

        self.checkForHTML5Audio = function(){
            if(!document.createElement('audio').canPlayType('audio/mpeg;')){
                alert('Current this site only work with Google Chrome, Firefox on Windows, Safari, and Internet Explorer 9+.' );
                window.location = 'http://google.com/chrome';
            }
        };

        self.checkForDesktopNotifications = function(){
            return !("Notification" in window);
        }

        self.checkForWebkitAudio = function(){
            return !("webkitAudioContext" in window);
        }

        self.enableNotificationsAction = function(){
            localStorage.setItem('enableNotifications', self.enableNotifications());

            if(self.enableNotifications()=== "Yes" ){
                Notification.requestPermission(function (permission) {
                // Whatever the user answers, we make sure Chrome stores the information
                    if(!('permission' in Notification)) {
                        Notification.permission = permission;
                    }
                });
            }

            return true ;
        };

        self.enableDancingBarsAction = function(){
           localStorage.setItem('enableDancingBars', self.enableDancingBars());
            return true ;
        };

        self.setSearchHash = function(){
            var search = self.searchValue().replace(/ /gi, '');
            search.toLowerCase();
                
            location.hash = search;
        };

        self.setArtistHash = function(data){
            location.hash = self.getArtistIdentifierFromTitle(data.title);
        };

        self.getArtistIdentifierFromTitle = function(title){
            if (!title) return;
            return _.findWhere(allArtistsList, {title: title }).identifier;
        };


        var getArtistNameFromHash = function(hash){
            $.each(allArtistsList,  function(k,v){
                if(v.identifier.toLowerCase() === hash.toLowerCase()){
                    self.artistName(v.title);
                    return false;
                }
            });
        };

        self.goToShow = function(){
            location.hash =  self.getArtistIdentifierFromTitle( self.currentSong().creator ) + '/' + self.currentSong().identifier;
        };

        self.goToArtist = function(){
            location.hash = self.getArtistIdentifierFromTitle( self.currentSong().creator );
        };

        self.setShowDetailsHash = function(show){
            var artist = (location.hash.indexOf('/') === -1) ? 1000 :  location.hash.indexOf('/');
            location.hash = location.hash.substring(1, artist) +'/'+ show.identifier;
        };

        self.populateAllArtistsList = function(callback){            
            $.ajax({
                url: ARCHIVE_ORG_API_URL + 'advancedsearch.php?q=mediatype%3Acollection+AND+collection%3Aetree&fl[]=identifier&fl[]=title&sort[]=titleSorter+asc&sort[]=&sort[]=&rows=10000&page=1&callback=callback&save=yes&output=json',
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

        self.getLatestShows = function(number){
            if (!number || number === undefined)
                number = 10;
            else
                number = parseInt(number, 10);

            $.ajax({
                url: ARCHIVE_ORG_API_URL + 'advancedsearch.php?q=collection%3Aetree&fl%5B%5D=avg_rating&fl%5B%5D=call_number&fl%5B%5D=collection&fl%5B%5D=contributor&fl%5B%5D=coverage&fl%5B%5D=creator&fl%5B%5D=date&fl%5B%5D=description&fl%5B%5D=downloads&fl%5B%5D=foldoutcount&fl%5B%5D=format&fl%5B%5D=headerImage&fl%5B%5D=identifier&fl%5B%5D=imagecount&fl%5B%5D=language&fl%5B%5D=licenseurl&fl%5B%5D=mediatype&fl%5B%5D=month&fl%5B%5D=num_reviews&fl%5B%5D=oai_updatedate&fl%5B%5D=publicdate&fl%5B%5D=publisher&fl%5B%5D=rights&fl%5B%5D=scanningcentre&fl%5B%5D=source&fl%5B%5D=subject&fl%5B%5D=title&fl%5B%5D=type&fl%5B%5D=volume&fl%5B%5D=week&fl%5B%5D=year&sort%5B%5D=publicdate+desc&sort%5B%5D=&sort%5B%5D=&rows='+number+'&page=1&output=json&callback=callback&save=yes',
                dataType: 'jsonp',
                type: 'GET',
                beforeSend: function(){
                }
            }).done(function(json){
                if (!json.response || json.response.docs.length === 0)
                    return;

                var shows = [];
                $.each(json.response.docs, function(k, v){
                    shows.push(new Show(v));
                })
                
                self.latestShows(shows);
                
            });
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
            });
            return response( $.map( filtered, function( item ) {
                        return {
                            label: item.title,
                            value: item.title,
                            hash: item.identifier
                        };
                    }));
        };

        self.getArtistBio = function(){
            $.ajax({
                url: LASTFM_API_URL + '?method=artist.getinfo&artist=' + self.artistName() + '&api_key=' + LASTFM_API_KEY + '&format=json',
                dataType: 'jsonp',
                type: 'GET',
                beforeSend: function(){
                }
            }).done(function(json){
                self.artistBio(new ArtistBio(json));
            });
        };

        self.search = function(search){

            if ($('.listDisplay').hasClass('ui-accordion'))
                $( '#accordion' ).accordion('destroy');
            
            if (xhr)
                xhr.abort();

            $('#myTab a[href="#search"]').tab('show');

            xhr = $.ajax({
                url: ARCHIVE_ORG_API_URL + 'advancedsearch.php',
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
                var byYear = {};
                byYear.shows = [];
                
                $.each(json.response.docs, function(k,v){
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
                url: ARCHIVE_ORG_API_URL + 'details/' + identifier,
                data: 'output=json',
                dataType: 'jsonp',
                type: 'GET',
                beforeSend: function(){
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
            savePlaylistToCache();
        };
        
        self.addAll = function(){
            $.each(self.showDetails().songs, function(index, song){
                self.addToPlaylist(song);
            });
            console.log(self.playlist());
            savePlaylistToCache();
        };

        self.removeFromPlaylist = function(data, event){
            self.playlist.remove(data);
            savePlaylistToCache();
        };

        self.removeAllFromPlaylist = function(data, event){
            self.playlist([]);
            removePlaylistFromCache();
        };

        var getSavedPlaylistsCache = function(){

            var list = JSON.parse(localStorage.getItem('playlist'));

            if (list === undefined || list === null)
                return [];

            var playlist = [];
            for (var i=0; i<list.length; i++){
                playlist.push(new PlaylistItem(list[i]))
            }

            return playlist;
        }

        var savePlaylistToCache = function(){
            localStorage.setItem('playlist', JSON.stringify(ko.toJS(self.playlist())));
        }

        var removePlaylistFromCache = function(){
            localStorage.removeItem('playlist');   
        }

        self.playSongFromPlaylist = function(playlistItem){
            var index = self.playlist.indexOf(playlistItem);
            playlistPosition = index;
            if (audioElement)
                self.pause();
            audioElement = null;
            self.resetTime();
            self.play();
        };

        //Play single song from show list
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
                var playlistItem;

                //reset isPlaying to false for previous song
                if (self.playlist.indexOf(playlistItemPrevious) !== -1){
                    self.playlist()[self.playlist.indexOf(playlistItemPrevious)].isPlaying(false);
                    self.playlist()[self.playlist.indexOf(playlistItemPrevious)].hasBeenPlayed(true);
                
                }
                //playListPlayingIndex = self.getSongFromPlaylist(playlistPosition);
                                


                playlistItem = self.playlist()[playlistPosition];
                console.log('playlistItem %o', playlistItem)
                playlistItemPrevious = playlistItem;
                var url = ARCHIVE_ORG_API_URL + 'download/' + playlistItem.song.identifier +'/' + playlistItem.song.file;

                playlistItem.isPlaying(true);
                playlistItem.hasBeenPlayed(false);

                //update the cache (localstorage)
                savePlaylistToCache();
                
                self.currentSong(playlistItem.song);
                audioElement = document.createElement('audio');
                audioElement.setAttribute('src', url);
                
                self.getDuration(); //sets the time and binds the slider 
                self.onSongEnd();
                //this is a test of these binds
                $(audioElement).on('waiting', function(e){
                    console.debug('Audio has triggered the onwaiting event');
                    //console.debug(e);
                });
                $(audioElement).on('suspend', function(e){
                    //console.debug('Audio has triggered the onsuspend event');
                    //console.debug(e);
                });
                $(audioElement).on('stalled', function(e){
                    console.debug('Audio has triggered the onstalled event');
                    //console.debug(e);
                });
                $(audioElement).on('error', function(e){
                    console.debug('Audio has triggered the onerror event');
                    console.debug(e);
                });
                $(audioElement).on('emptied', function(e){
                    console.debug('Audio has triggered the onemptied event');
                    //console.debug(e);
                });

                $(audioElement).on('canplay', function(e){
                    //ENABLE THE AWESOME BARS!!!!
                    if(self.enableDancingBars() === "Yes")
                        bars(audioElement);
                });
                //End test
                audioElement.volume = volumeState;
            }

            self.showPause(true);
            audioElement.play();

            if (self.enableNotifications() === "Yes")
                notify(playlistItem);   
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

        var routes = function(){
            
            Sammy(function() {

                this.get('#:artist', function() {
                    self.searchResults([]); //clear previous search 
                    self.searchResultsByYear([]);
                    getArtistNameFromHash(this.params.artist);
                    self.search(this.params.artist);
                    self.getArtistBio();
                });

                this.get('#:artist/:show', function() {
                    //if loading from scratch then load both show list and details
                    if (self.artistName() === '' || self.artistName === undefined ){
                        self.search(this.params.artist);
                        getArtistNameFromHash(this.params.artist);
                    }
                    self.artistBio('');
                    self.getShowDetails(this.params.show);
                });

                this.get('', function() {
                    //do this when there isnt a hash tag
                    self.getLatestShows(10);
                    self.artistBio('');
                    self.showDetails(new ShowDetails());
                });

            }).run();
        };

        //***************************************
        //      Storage Function
        //***************************************
        
        self.addShowToFavorites = function(){
            var favorites;
            if (localStorage.favorites){
                favorites = JSON.parse(localStorage.favorites);
            }else{
                favorites = {};
                favorites.shows = [];               }
            var details = ko.toJS(self.showDetails);
            self.favoriteShows.push(details);
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

        /******************************************************
            Desktop notifications
        ******************************************************/

        var notify = function(currentSong) { 
            
            var title = currentSong.song.title + ' by ' + currentSong.song.creator; 
            var obj = {
                tag:'song_info',
                body:currentSong.song.album,
                icon: location.protocol + '//' +location.host + (location.pathname==='/' ? location.pathname : location.pathname + "/") + "img/g.gif"
            }

            // Let's check if the user is okay to get some notification
            if (Notification.permission === "granted") {
                showNotification();
            }else{
                self.enableNotificationsAction();
                showNotification();
            }

            function showNotification(){
                // If it's okay let's create a notification
                var notification = new Notification(title, obj);
                setTimeout(function(){
                  notification.close();
                } , 5000);
            }
        }

        //THis is copy and pasted with very little modification.
        //Needs cleaned up
        //http://html5-demos.appspot.com/static/webaudio/createMediaSourceElement.html
        var bars = function(audioElement) {
            var canvas = document.getElementById('fft');
            var ctx = canvas.getContext('2d');
            canvas.width = document.body.clientWidth / 1.4;

            const CANVAS_HEIGHT = canvas.height;
            const CANVAS_WIDTH = canvas.width;

            var context = null;
            //wrapped in try..catch.. becuase of some audio issues on chrome in windows.
            try{
                context = new webkitAudioContext();
                var analyser = context.createAnalyser();
            }catch(e){
                console.log("Error with audiocontext: " +e.message);
                return;
            }   

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

                var gradient = ctx.createLinearGradient(0,0,0,canvas.height);
                gradient.addColorStop(1,'#8cc84b');
                gradient.addColorStop(0.50,'#453');
                gradient.addColorStop(0,'#453');

                ctx.fillStyle = gradient;
                ctx.lineCap = 'round';

                // Draw rectangle for each frequency bin.
                for (var i = 0; i < numBars; ++i) {
                    var magnitude = freqByteData[i + OFFSET] / 2;
                    ctx.fillRect(i * SPACER_WIDTH, CANVAS_HEIGHT, BAR_WIDTH, -magnitude);
                }
            }

            var source = context.createMediaElementSource(audioElement);
            source.connect(analyser);
            analyser.connect(context.destination);

            rafCallback();
        };
     };

});

