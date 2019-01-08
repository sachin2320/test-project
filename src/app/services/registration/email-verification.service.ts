import { Injectable } from '@angular/core';
import { AppConfig } from "app/configuration/app.config";
import { ErrorService } from "app/shared-services/error.service";
import { ResponseModel } from "app/models/response.model";
import { Observable } from "rxjs/Rx";
import { HttpService } from "app/services/http/http.service";

@Injectable()
export class EmailVerificationService {
    private apiBaseUrl: string = this.config.getConfig("apiBaseUrl");

    constructor(private httpClient: HttpService, public config: AppConfig, private errService: ErrorService) {

    }

    confirmEmail(userName: string, verificationCode: string): Observable<any> {
        let url = this.apiBaseUrl + this.config.getConfig("confirmEmailUrl");

        let model = { "userName": userName, "VerificationCode": verificationCode };

        return this.httpClient.post(url, model, null, false).map(res => {
            let result = res.text() ? res.json() : {};
            return result;
        }).catch(this.errService.handleError);
    }

    resendEmailConfirmationToken(userName: string): Observable<any> {
        let url = this.apiBaseUrl + this.config.getConfig("resendEmailConfirmUrl");

        let model = { "UserName": userName };

        return this.httpClient.post(url, model, null, false).map(res => {
            let result = res.text() ? res.json() : {};
            return result;
        }).catch(this.errService.handleError);
    }
}