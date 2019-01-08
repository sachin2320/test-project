import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Router } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { TokenService } from "app/services/token/token.service";
import { TokenResponse } from "app/models/tokenResponse";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AppConfig } from "app/configuration/app.config";

@Injectable()
export class AuthenticationService {
      
    redirectUrl: string = '';

    constructor(private token: TokenService, private router: Router,public config: AppConfig) { }

    logOut() {
        this.token.resetToken();
        this.router.navigate([this.config.getConfig('appLoginUrl')]);
    }

    logOutSuccessful() {
        this.token.resetToken();
        this.router.navigate([this.config.getConfig('appLoginSuccessfulUrl')]);
    }

    authenticate(authRequire: boolean = true) {
        return Observable.create(observer => {
            if (authRequire && !this.isUserAuthenticationValid()) {
                this.token.renewToken().subscribe(res => {
                    if (res.Success) {
                       observer.next(true);
                    }
                    else {
                        observer.next(false);
                    }
                    observer.complete();
                }, error => {
                    observer.next(false);
                    observer.complete();
                });
            }
            else {
                return observer.next(true);
            }
        });
    }

    isUserAuthenticated(): boolean {
        return this.token.IsAccessTokenValid && this.token.IsRefreshTokenValid;
    }

    issueAccessToken(user: string, password: string): Observable<TokenResponse> {
        return this.token.issueAccessToken(user, password);
    }

    isUserAuthenticationValid(): boolean {
        return !this.token.IsAccessTokenExpired && this.token.IsRefreshTokenValid;
    }

    clearToken()
    {
        this.token.resetToken();
    }

}
