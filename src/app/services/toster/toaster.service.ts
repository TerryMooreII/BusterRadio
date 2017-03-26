import {Injectable} from '@angular/core';

declare var Materialize: any;

@Injectable()
export class ToasterService {

    constructor() {
    }

    toast(message: string, duration: number = 3000, style = '') {
        Materialize.toast(message, duration, style);
    }
}
