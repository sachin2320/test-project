import { Injectable } from '@angular/core';
import { AppConfig } from "app/configuration/app.config";
import { ErrorService } from "app/shared-services/error.service";
import { RegistrationModel } from "app/models/Registration.model";
import { ResponseModel } from "app/models/response.model";
import { Observable } from "rxjs/Rx";
import { HttpService } from "app/services/http/http.service";

@Injectable()
export class RegistrationService {
    apiBaseUrl: string = this.config.getConfig("apiBaseUrl");

    constructor(private httpClient: HttpService, public config: AppConfig, private errService: ErrorService) { }

    registerUser(model: RegistrationModel): Observable<ResponseModel> {
        let url = this.apiBaseUrl + this.config.getConfig("registrationUrl");
        return this.httpClient.post(url, model,null,false).map(res => {
            let result = res.text() ? res.json() : {};
            return new ResponseModel(result.isSuccess,result.errorCode, result.message);
        }).catch(this.errService.handleError);
    }

    isUserIdAndEmailInUsed(userId : string,email : string): Observable<any> {
        let url = this.apiBaseUrl + this.config.getConfig("isUserAndEmailInUseUrl") + "?userId=" + userId.replace(/#/g, "%23") + "&emailId=" + email;
        // console.log(url);
        return this.httpClient.get(url,null,false).map(res => {
            let responseObject = res.text() ? res.json() : {};
            return responseObject;
        })
        .catch(this.errService.handleError);
    }
}