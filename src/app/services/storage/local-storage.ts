import { Injectable } from '@angular/core'; 

@Injectable()
export class StorageService {
    saveKey(keyName, keyValue) {
        if (localStorage.getItem(keyName)) {
            localStorage.removeItem(keyName);
        }
        localStorage.setItem(keyName, keyValue);
    }

    readKey(keyName) {
        if (localStorage.getItem(keyName)) {
            return localStorage.getItem(keyName);
        }
        return '';
    }

    removeKey(keyName) {
        if (localStorage.getItem(keyName)) {
            localStorage.removeItem(keyName);
        }
    }
}
