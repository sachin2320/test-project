import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from "app/configuration/app.config";
import { ContentType } from "app/enums/content-type.enum";
import { StorageService } from "app/services/storage/local-storage";
import { AuthenticationService } from "app/services/auth-service/authentication.service";

@Injectable()
export class HttpService {

    apiBaseUrl: string = this.config.getConfig("apiBaseUrl");

    constructor(private http: Http,
        private auth: AuthenticationService,
        private appStorage: StorageService,
        public config: AppConfig) { }

    getRequestHeader(contentType: ContentType = ContentType.ApplicationJson,
        includeBearerToken: boolean = true,
        includeCsrfToken: boolean = true): Headers {

        let header = new Headers();
        // header.set('Access-Control-Allow-Origin','*');
        // header.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, Accept');

        if (contentType == ContentType.ApplicationJson)
            header.set('Content-Type', 'application/json');
        else if (contentType == ContentType.xwwwformurlencoded)
            header.set('Content-Type', 'application/x-www-form-urlencoded');

        if (includeBearerToken)
            header.set('Authorization', 'Bearer ' + this.appStorage.readKey(this.config.getConfig("access_token_key")));

        if (includeCsrfToken)
            header.set('X-XSRF-Token', this.appStorage.readKey(this.config.getConfig("csrf_Token_key")));

        return header;
    }

    get(url: string, reqOption: RequestOptions = null, authRequire: boolean = true): Observable<Response> {
        return this.auth.authenticate(authRequire).flatMap(authenticated => {
            if (authenticated) {
                let options = null;
                if (reqOption == null || reqOption == undefined)
                    options = new RequestOptions({ headers: this.getRequestHeader() });
                else
                    options = reqOption;

                return this.http.get(url, options);
            }
            else {
                this.auth.logOut();
                return Observable.throw('Unable to re-authenticate');
            }
        });
    }

    downloadFile(url: string, reqOption: RequestOptions = null, authRequire: boolean = true): Observable<any> {
        return this.auth.authenticate(authRequire).flatMap(authenticated => {
            if (authenticated) {
                let options = null;
                if (reqOption == null || reqOption == undefined)
                    options = new RequestOptions({ responseType: ResponseContentType.Blob, headers: this.getRequestHeader() });
                else
                    options = reqOption;

                return this.http.get(url, options)
                    .map(res => {
                        return new Blob([res.blob()], { type: 'application/pdf' })
                    });
            }
            else {
                this.auth.logOut();
                return Observable.throw('Unable to re-authenticate');
            }
        });
    }

    post(url: string, data: any, reqOption: RequestOptions = null, authRequire: boolean = true): Observable<Response> {
        return this.auth.authenticate(authRequire).flatMap(authenticated => {
            if (authenticated) {
                let options = null;
                if (reqOption == null || reqOption == undefined)
                    options = new RequestOptions({ headers: this.getRequestHeader(ContentType.ApplicationJson) });
                else
                    options = reqOption;

                let jsonData = (data == null) ? {} : JSON.stringify(data);
                return this.http.post(url, jsonData, options);
            }
            else {
                this.auth.logOut();
                return Observable.throw('Unable to re-authenticate');
            }
        });
    }

    postFormData(url: string, data: FormData, reqOption: RequestOptions = null, authRequire: boolean = true): Observable<Response> {
        return this.auth.authenticate(authRequire).flatMap(authenticated => {
            if (authenticated) {
                let header = this.getRequestHeader(ContentType.None);
                let options = new RequestOptions({ headers: header });
                return this.http.post(url, data, options);
            }
            else {
                this.auth.logOut();
                return Observable.throw('Unable to re-authenticate');
            }
        });
    }
}
