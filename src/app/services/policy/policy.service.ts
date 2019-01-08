import { Injectable } from '@angular/core';
import { AppConfig } from "app/configuration/app.config";
import { PolicyUsageIndicator } from 'app/enums/policy-usage-indicator.enum';
import { PolicyModel } from "app/models/policy.model";
import { PolicyDocument } from "app/models/policyDocument.model";
import { PolicyListModel } from "app/models/policyList.model";
import { HttpService } from "app/services/http/http.service";
import { ErrorService } from "app/shared-services/error.service";
import { Observable } from "rxjs/Rx";

@Injectable()
export class PolicyService {
    apiBaseUrl: string = this.config.getConfig("apiBaseUrl");

    constructor(private httpClient: HttpService,
        public config: AppConfig,
        private errService: ErrorService) { }

    getPolicyList(indicator: PolicyUsageIndicator, policyNumber: string = ""): Observable<PolicyListModel> {

        let url = this.apiBaseUrl + this.config.getConfig("userPolicyListUrl").replace("{indicator}", indicator);
        if (policyNumber != "")
            url = url + "/" + policyNumber;

        return this.httpClient.get(url).map(res => {
            let responseObject = res.text() ? res.json() : {};
            let annuityPolicy: PolicyModel[] = responseObject.data.annuity;
            let lifePolicy: PolicyModel[] = responseObject.data.life;
            return new PolicyListModel(annuityPolicy, lifePolicy, []);
        })
            .catch(this.errService.handleError);
    }

    getUserPolicies(indicator: PolicyUsageIndicator, policyNumber: string = ""): Observable<PolicyModel[]> {
        let url = this.apiBaseUrl + this.config.getConfig("userPolicyListUrl").replace("{indicator}", indicator);
        if (policyNumber != "")
            url = url + "/" + policyNumber;

        return this.httpClient.get(url).map(res => {
            let responseObject = res.text() ? res.json() : {};
            let annuityPolicy: PolicyModel[] = responseObject.data.annuity;
            let lifePolicy: PolicyModel[] = responseObject.data.life;

            let policies = annuityPolicy.concat(lifePolicy);
            return policies;
        })
            .catch(this.errService.handleError);
    }

    isPolicyExists(policyNumber: string, ownerLastName: string, ownerSsn: string, trustName: string): Observable<any> {
        let url = this.apiBaseUrl + this.config.getConfig("policyExistsUrl");

        let model = {
            "policyNum": policyNumber,
            "lastName": ownerLastName,
            "ssn": ownerSsn,
            "entityName": trustName
        };

        return this.httpClient.post(url, model, null, false).map(res => {
            let responseObject = res.text() ? res.json() : {};
            return responseObject;
        })
            .catch(this.errService.handleError);
    }

    verifyOwnerSsn(policyNumber: string, ownerDob: string, ownerSsn: string, isValidateFullSsn: boolean): Observable<any> {
        let url: string = (this.apiBaseUrl + this.config.getConfig("verifyOwnerSsnUrl"));
        let model = { "policyNumber": policyNumber, "ownerDob": ownerDob, "ownerSsn": ownerSsn, "isValidateFullSsn": isValidateFullSsn };
        return this.httpClient.post(url, model, null, false).map(res => {
            let responseObject = res.text() ? res.json() : {};
            return responseObject;
        })
            .catch(this.errService.handleError);
    }

    // MJD 2018-02-16 Security Assessment: Change GET to POST
    getPolicyDetails(policyNumber: string) {
        let url: string = (this.apiBaseUrl + this.config.getConfig("policyDetailsUrl"));
        return this.httpClient.post(url, policyNumber).map(res => {
            let responseObject = res.text() ? res.json() : {};
            return responseObject;
        })
            .catch(this.errService.handleError);
    }

    // MJD 2018-02-16 Security Assessment: Change GET to POST
    getPolicyDocumentList(policyNumber: string): Observable<PolicyDocument[]> {
        let url = String(this.apiBaseUrl + this.config.getConfig("policyDocumentListUrl"));
        return this.httpClient.post(url, policyNumber).map(res => {
            let responseObject = res.text() ? res.json() : {};
            return responseObject;
        })
            .catch(this.errService.handleError);
    }

    getPolicyDocument(policyNumber: string, documentId: string, openDocInNewTab: boolean, documentType: string): Observable<any> {
        let url = String(this.apiBaseUrl + this.config.getConfig("policyDocumentUrl"))
            .replace("{policyNumber}", policyNumber)
            .replace("{policyDocumentId}", documentId)
            .replace("{openDocInNewTab}", openDocInNewTab.toString())
            .replace("{policyDocumentType}", documentType);
        // debugger;
        //to open doc in new tab we need result as of json type 
        if (openDocInNewTab) {
            return this.httpClient.get(url)
                .map(res => {
                    let resJson = res.text() ? res.json() : {};
                    return resJson;
                })
                .catch(this.errService.handleError);
        }//to download doc directly we need result type as blob
        else {
            return this.httpClient.downloadFile(url).map(res => {
                return res;
            })
                .catch(this.errService.handleError);
        }
    }

    isUserHasActivePolicy(): Observable<any> {
        let url = this.apiBaseUrl + this.config.getConfig("isUserHasActivePolicyUrl");

        return this.httpClient.get(url).map(res => {
            let responseObject = res.text() ? res.json() : {};
            return responseObject
        })
            .catch(this.errService.handleError);
    }
}