
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AppConfig } from "app/configuration/app.config";
import { Observable } from "rxjs/Rx";
import { SecurityQuestionModel } from "app/models/securityQuestion.model";
import { HttpService } from "app/services/http/http.service";

@Injectable()
export class CommonService {

    baseApi: string = "";

    constructor(private httpClient: HttpService, private router: Router, public config: AppConfig) {
        this.baseApi = this.config.getConfig("apiBaseUrl");
    }

    getStates(countryCode: string) {
        return this.httpClient.get(this.baseApi + this.config.getConfig("stateUrl") + "?countryCode=" +countryCode, null, false)
            .map(res => {
                let resJson = res.text() ? res.json() : [];
                return resJson;
            })
            .catch(this.handleError);
    }

    getCountries() {
        return this.httpClient.get(this.baseApi + this.config.getConfig("countryUrl"), null, false)
            .map(res => {
                let resJson = res.text() ? res.json() : [];
                return resJson;
            })
            .catch(this.handleError);
    }

    getSecurityQuestion() {
        return this.httpClient.get(this.baseApi + this.config.getConfig("securityQuestion"), null, false)
            .map(res => {
                let response = res.text() ? res.json() : {};
                let result: SecurityQuestionModel = new SecurityQuestionModel(response.securityQuestion1, response.securityQuestion2, response.securityQuestion3);
                return result;
            })
            .catch(this.handleError);
    }

    getUserSecurityAnswers(){
        
        return this.httpClient.get(this.baseApi + this.config.getConfig("userSecurityAnswers"), null, false)
        .map(res => {
            let resJson = res.text() ? res.json() : [];
                return resJson;
        })
        .catch(this.handleError);
    }
    updateUserSecurityQuestions(data: any){
       
        let url = this.baseApi + this.config.getConfig("updateUserSecurityQuestions");
        let model=   {
            SelectedSecurityQuestionId1: data.securityQuestionId1,
            SelectedSecurityQuestionId2: data.securityQuestionId2,
            SelectedSecurityQuestionId3: data.securityQuestionId3,
            SecurityAnswer1: data.answer1,
            SecurityAnswer2: data.answer2,
            SecurityAnswer3: data.answer3,
            SecurityCustomQuestion1: data.securityCustomQuestion1,
            securityCustomQuestion2: data.securityCustomQuestion2,
            securityCustomQuestion3: data.securityCustomQuestion3,
            securityAnswerId1:data.securityAnswerId1,
            securityAnswerId2:data.securityAnswerId2,
            securityAnswerId3:data.securityAnswerId3,
            }

        return this.httpClient.post(url, model, null, true).map(res => {
            let result = res.text() ? res.json() : {};
            return result;
        }).catch(this.handleError);
    }
    handleError(error: any) {
        let errMsg: string = "";
        if (error.status && error.status == 401)
            errMsg = "User name or password is incorrect.";
        else {
            if (error._body) {
                try {
                    var errorObject = JSON.parse(error._body);
                    if (errorObject.error_description)
                        errMsg = errorObject.error_description;
                    if (errorObject.message && !errMsg)
                        errMsg = errorObject.message;
                    if (errorObject.error)
                        errMsg = errorObject.error;
                }
                catch (ex) {
                    errMsg = 'Server error';
                }
            }

            if (!errMsg) {
                errMsg = error.message || 'Server error';
            }
        }
        return Observable.throw(errMsg);
    }
}