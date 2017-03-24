import {Directive, OnInit} from '@angular/core';
import {PlaylistService} from "../services/playlist/playlist.service";
import {CacheService} from "../services/cache/cache.service";


declare var Notification: any;

@Directive({
    selector: '[brNotification]'
})
export class NotificationDirective implements OnInit {

    constructor(private playlist: PlaylistService, private cache:CacheService) {
        if (!Notification) {
            alert('Desktop notifications not available in your browser. Try Google Chrome.');
            return;
        }

        document.addEventListener('DOMContentLoaded', function () {
            if (Notification.permission !== "granted")
                Notification.requestPermission();
        });
    }

    ngOnInit() {
        this.playlist.getPlayer().subscribe(item => {
            this.notify(item);
        });
    }

    bandImage(artist){
        if (!artist){
            return ''
        }
        var url = 'http://archive.org/services/img/' + this.cache.getIdentifierByArtist(artist);
        return url;

    }

    private hasData(data){
        return data ? data : ' ';
    }

    notify(item) {

        if (Notification.permission !== "granted")
            Notification.requestPermission();
        else {
            var notification = new Notification(this.hasData(item.track.title), {
                icon: this.bandImage(item.track.creator),
                body: this.hasData(item.track.creator) + ' ' + this.hasData(item.track.album)
            });

            setTimeout(() =>{
                notification.close();
            }, 5000);
            //
            // notification.onclick = function () {
            //     open("http://stackoverflow.com/a/13328397/1269037");
            // };

        }
    }


}
