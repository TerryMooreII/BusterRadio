import { Injectable } from '@angular/core';

@Injectable()
export class NullifyService {

  constructor() { }


    isObject(val) {
        if (val === null || !val) {
            return false;
        }
        return ( (typeof val === 'function') || (typeof val === 'object') );
    }

    nullify(obj) {
        let newObj = {};
        Object.keys(obj).forEach(key => {
            if (obj[key] == null){
                newObj[key] = null;
            } else if (this.isObject(obj[key])) {
                newObj[key] = this.nullify(obj[key]);
            }else {
                newObj[key] = obj[key];
            }
        });
        
        return newObj;
    }
}
