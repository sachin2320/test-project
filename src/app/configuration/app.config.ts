import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { globalConstants } from '../shared-services/global-constants';
import { UAParser } from 'ua-parser-js';
import { ACTUAL_INPUT_EVENT_MANAGER_PLUGIN_PROVIDER } from '../../../node_modules/angular-actual-input-event-manager-plugin/dist';

@Injectable()
/* This service is used to read configuration json file */
export class AppConfig {
    public config: Object = null;
    private env: Object = null;

    constructor(private http: Http) { }

    public getConfig(key: any) {
        var actualKey = "";
        switch (key) {
            case "access_token_key":
                actualKey = globalConstants.access_token_key;
                break;

            case "csrf_Token_key":
                actualKey = globalConstants.csrf_Token_key;
                break;

            case "refresh_Token_key":
                actualKey = globalConstants.refresh_Token_key;
                break;

            case "account_name_key":
                actualKey = globalConstants.account_name_key;
                break;

            case "userId_key":
                actualKey = globalConstants.userId_key;
                break;

            case "first_name_key":
                actualKey = globalConstants.first_name_key;
                break;

            case "sr_return_url_key":
                actualKey = globalConstants.sr_return_url_key;
                break;

            case "simulated_user_key":
                actualKey = globalConstants.simulated_user_key;
                break;

            case "simulated_user_permissions_key":
                actualKey = globalConstants.simulated_user_permissions_key;
                break;
        }

        if (actualKey == "") {
            return this.config[key];
        }

        return this.config[actualKey];
    }

    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('assets/env.config.json').map(res => res.json()).catch((error: any): any => {
                let errMessage = 'Configuration file "env.config.json" could not be read';
                console.error(errMessage);
                resolve(true);
                return Observable.throw(error.json().error || errMessage);
            }).subscribe((envResponse) => {
                this.env = envResponse;
                this.http.get('assets/app.config.' + envResponse.env + '.json')
                    .map(res => res.json())
                    .catch((error: any) => {
                        let errMessage = 'Error reading ' + envResponse.env + ' configuration file';
                        console.error(errMessage);
                        resolve(error);
                        return Observable.throw(error.json().error || errMessage);
                    })
                    .subscribe((responseData) => {
                        this.config = responseData;
                        resolve(true);
                    });
            });
        });
    }  
}