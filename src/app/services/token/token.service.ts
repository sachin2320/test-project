import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions, ResponseContentType, Http } from '@angular/http';
import { AppConfig } from "app/configuration/app.config";
import { ErrorService } from "app/shared-services/error.service";
import { Observable } from "rxjs/Rx";
import { TokenResponse } from "app/models/tokenResponse";
import { HttpService } from "app/services/http/http.service";
import { StorageService } from "app/services/storage/local-storage";
import { JwtHelper } from "app/common/helper/jwt-helper";

@Injectable()
export class TokenService {
    apiBaseUrl: string = this.config.getConfig("apiBaseUrl");
    jwtHelper: JwtHelper = new JwtHelper();

    private accessTokenKey: string = this.config.getConfig("access_token_key");
    private refreshTokenKey: string = this.config.getConfig("refresh_Token_key");
    private accountName: string = this.config.getConfig("account_name_key");
    private returnUrlKey: string = this.config.getConfig("sr_return_url_key");
    private simulatedUserKey: string = this.config.getConfig("simulated_user_key");
    private simulatedUserPermissionsKey: string = this.config.getConfig("simulated_user_permissions_key");

    constructor(private httpClient: Http, private appstorage: StorageService, public config: AppConfig, private errService: ErrorService) { }

    get IsAccessTokenExpired(): boolean {
        let token = this.appstorage.readKey(this.accessTokenKey);
        if (token)
            return this.jwtHelper.isTokenExpired(token);
        else
            return true;
    }

    get IsAccessTokenValid(): boolean {
        let token = this.appstorage.readKey(this.accessTokenKey);
        if (token)
            return true;
        else
            return false;
    }

    get AccessTokenExpirationDate(): Date {
        let token = this.appstorage.readKey(this.accessTokenKey);
        if (token)
            return this.jwtHelper.getTokenExpirationDate(token);
        else
            return null;
    }

    get IsRefreshTokenValid(): boolean {
        let token = this.appstorage.readKey(this.refreshTokenKey);
        if (token)
            return true;
        else
            return false;
    }

    issueAccessToken(user: string, password: string): Observable<TokenResponse> {
        this.resetToken();
        let headers = new Headers();
        headers.set('Content-Type', 'application/json');

        let model = { "username": user, "password": password };
        let options = new RequestOptions({ headers: headers });

        let url = this.apiBaseUrl + this.config.getConfig("apiTokenUrl");
        //return this.httpClient.get(url, options)
        return this.httpClient.post(url, model, options)
            .map(res => {
                let response = this.parseJSON(res);
                let token: any = {};
                let email: string = "";

                if (response.isSuccess) {
                    this.saveToken(response.data);
                    if (response.data != null) {
                        token = response.data;
                        if (response.data.email != undefined)
                            email = response.data.email;
                    }
                }
                else {
                    if (response.data != null && response.data != undefined && response.data.email != undefined)
                        email = response.data.email;
                }
                return new TokenResponse(response.isSuccess, response.code, response.message, token.access_token, token.refresh_token, "", "", email, token.name);
            })
            .catch(this.errService.handleError);
    }

    renewToken(): Observable<TokenResponse> {
        let headers = new Headers();
        headers.set('Content-Type', 'application/json');
        var data = "refreshToken=" + this.appstorage.readKey(this.refreshTokenKey);
        let options = new RequestOptions({ headers: headers });
        let url = this.apiBaseUrl + this.config.getConfig("apiRenewTokenUrl") + "?" + data;
        return this.httpClient.get(url, options)
            .map(res => {
                this.resetToken();
                let response = this.parseJSON(res);
                let token: any = {};
                if (response.isSuccess) {
                    this.saveToken(response.data);
                    if (response.data != null)
                        token = response.data;
                }
                return new TokenResponse(response.isSuccess, response.code, response.message, token.access_token, token.refresh_token);
            })
            .catch(this.errService.handleError);
    }

    resetToken() {
        this.appstorage.removeKey(this.accessTokenKey);
        this.appstorage.removeKey(this.accountName);
        this.appstorage.removeKey(this.refreshTokenKey);
        this.appstorage.removeKey(this.returnUrlKey);
        this.appstorage.removeKey(this.simulatedUserKey);
        this.appstorage.removeKey(this.simulatedUserPermissionsKey);
    }

    saveToken(value: any) {
        this.appstorage.saveKey(this.accessTokenKey, value.access_token);
        this.appstorage.saveKey(this.accountName, value.name);
        this.appstorage.saveKey(this.refreshTokenKey, value.refresh_token);

        //Check if user is simulated
        let isSimulatedUser = this.isSimulatedUser();
        //Store simulated user flag to local storage
        this.appstorage.saveKey(this.simulatedUserKey, isSimulatedUser);

        if(isSimulatedUser){
            //Get simulated user permissions
            let simulatedUserPermissions = this.getSimulatedUserPermissions();
            //Store simulated user permissions to local storage
            this.appstorage.saveKey(this.simulatedUserPermissionsKey, simulatedUserPermissions);
        }
    }

    parseJSON(response: Response) {
        return response.text() ? response.json() : {};
    }

    getSimulatedUserPermissions(): string {
        let token = this.appstorage.readKey(this.accessTokenKey);
        if (token)
            return this.jwtHelper.getSimulatedUserPermissions(token);
        else
            return "";
    }

    isSimulatedUser(): boolean {
        let token = this.appstorage.readKey(this.accessTokenKey);
        if (token)
            return this.jwtHelper.isSimulatedUser(token);
        else
            return false;
    }
}
