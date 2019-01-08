import { Injectable } from '@angular/core';
import { AppConfig } from "app/configuration/app.config";
import { ErrorService } from "app/shared-services/error.service";
import { ResponseModel } from "app/models/response.model";
import { Observable } from "rxjs/Rx";
import { HttpService } from "app/services/http/http.service";
import { AnswerVerificationType } from "app/enums/account-action-category.enum";

@Injectable()
export class ForgotPasswordService {
    private apiBaseUrl: string = this.config.getConfig("apiBaseUrl");

    constructor(private httpClient: HttpService, public config: AppConfig, private errService: ErrorService) { }

    // MJD 2018-02-16 Security Assessment - Change GET to POST
    userSecurityQuestions(userName: string = "", userLastNameOrEntityName: string = "", last4digitOfSsn: string = "", userPolicy: string = ""): Observable<any> {
        // console.log('userSecurityQuestions');
        let model = { "userName": userName, "lastNameOrEntityName": userLastNameOrEntityName, "last4DigitsOfSsn": last4digitOfSsn, "userPolicy": userPolicy };
        // console.log('userSecurityQuestions - model: ' + model);
        let url = this.apiBaseUrl + this.config.getConfig("userSecurityQuestionUrl");
        // console.log('userSecurityQuestions - url: ' + url);
        return this.httpClient.post(url, model, null, false).map(res => {
            return res.text() ? res.json() : {};
        }).catch(this.errService.handleError);
    }

    verifyUserSecurityAnswer(questionId: number, answer: string, userName: string = "", userLastNameOrEntityName: string = "", last4digitOfSsn: string = "", userPolicy: string = "", verificationType: AnswerVerificationType = AnswerVerificationType.All, securityQuestionOrder:number = 0): Observable<any> {
        let model = { "userName": userName, "questionId": questionId, "answer": answer, "lastNameOrEntityName": userLastNameOrEntityName, "last4DigitsOfSsn": last4digitOfSsn, "policyNumber": userPolicy, "verificationType": + verificationType, "securityQuestionOrder": securityQuestionOrder };
        let url = this.apiBaseUrl + this.config.getConfig("verifyUserAnswerUrl");
        return this.httpClient.post(url, model, null, false).map(res => {
            return res.text() ? res.json() : {};
        }).catch(this.errService.handleError);
    }

    generateTempPassword(userName: string, questionId: number, answer: string): Observable<any> {
        let model = { "userName": userName, "questionId": questionId, "answer": answer };
        let url = this.apiBaseUrl + this.config.getConfig("generateTempPasswordUrl");
        return this.httpClient.post(url, model, null, false).map(res => {
            return res.text() ? res.json() : {};
        }).catch(this.errService.handleError);
    }

    changeTempPassword(userName: string, tempPswd: string, newPswd: string): Observable<any> {
        let url = this.apiBaseUrl + this.config.getConfig("changeTempPasswordUrl");
        let model = { "userName": userName, "tempPassword": tempPswd, "newPassword": newPswd };

        return this.httpClient.post(url, model, null, false).map(res => {
            let result = res.text() ? res.json() : {};
            return result;
        }).catch(this.errService.handleError);
    }

    // MJD 2018-02-16 Security Assessment - Change GET to POST
    getUserName(questionId: number, answer: string, userLastNameOrEntityName: string = "", last4digitOfSsn: string = "", userPolicy: string = "", securityQuestionOrder: number = 0): Observable<any> {
        let model = { "questionId": questionId, "answer": answer, "lastNameOrEntityName": userLastNameOrEntityName, "last4DigitsOfSsn": last4digitOfSsn, "policyNumber": userPolicy, "securityQuestionOrder": securityQuestionOrder };
        let url = this.apiBaseUrl + this.config.getConfig("getUserNameUrl");
        return this.httpClient.post(url, model, null, false).map(res => {
            return res.text() ? res.json() : {};
        }).catch(this.errService.handleError);
    }

    // MJD 2018-03-26 Security Assessment - Change GET to POST
    changeUserEmail(
        email: string,
        questionId: number,
        answer: string,
        userLastNameOrEntityName: string = "",
        last4digitOfSsn: string = "",
        userPolicy: string = "",
        isPrimaryEmail: boolean): Observable<any> {
        let model = {
            "email": email,
            "questionId": questionId,
            "answer": answer,
            "lastNameOrEntityName": userLastNameOrEntityName,
            "last4DigitsOfSsn": last4digitOfSsn,
            "policyNumber": userPolicy,
            "isPrimaryEmail": isPrimaryEmail
        };
        // let model = { "email": email, "questionId": questionId, "answer": answer, "lastNameOrEntityName": userLastNameOrEntityName, "last4DegitOfSsn": last4digitOfSsn, "policyNumber": userPolicy};
        // console.log('changeUserEmail.model = ' + JSON.stringify(model));
        let url = this.apiBaseUrl + this.config.getConfig("changeAccountEmailUrl");
        return this.httpClient.post(url, model, null, false).map(res => {
            return res.text() ? res.json() : {};
        }).catch(this.errService.handleError);
    }

    changePassword(oldPwd: string, newPwd: string, confirmPwd: string): Observable<any> {
        let url = this.apiBaseUrl + this.config.getConfig("changePasswordUrl");
        let model = { "OldPassword": oldPwd, "NewPassword": newPwd, "ConfirmPassword": confirmPwd };

        return this.httpClient.post(url, model, null, true).map(res => {
            let result = res.text() ? res.json() : {};
            return result;
        }).catch(this.errService.handleError);
    }

    changeEmail(oldEmail: string, newEmail: string, confirmEmail: string, isPrimaryEmail: boolean): Observable<any> {
        let url = this.apiBaseUrl + this.config.getConfig("changeEmailUrl");
        let model = { "OldEmail": oldEmail, "NewEmail": newEmail, "ConfirmEmail": confirmEmail, "IsPrimaryEmail": isPrimaryEmail };

        return this.httpClient.post(url, model, null, true).map(res => {
            let result = res.text() ? res.json() : {};
            return result;
        }).catch(this.errService.handleError);
    }

    changePhone(oldPhone: string, newPhone: string, confirmPhone: string, isPrimaryContact: boolean): Observable<any> {
        let url = this.apiBaseUrl + this.config.getConfig("changeUserPhoneUrl");
        let model = { "OldPhone": oldPhone, "NewPhone": newPhone, "ConfirmPhone": confirmPhone, "isPrimaryContact": isPrimaryContact };

        return this.httpClient.post(url, model, null, true).map(res => {
            let result = res.text() ? res.json() : {};
            return result;
        }).catch(this.errService.handleError);
    }
}