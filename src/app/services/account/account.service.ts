import { Injectable } from '@angular/core';
import { AppConfig } from "app/configuration/app.config";
import { ErrorService } from "app/shared-services/error.service";
import { Observable } from "rxjs/Rx";
import { HttpService } from "app/services/http/http.service";
import { AccountActionCategory } from "app/enums/account-action-category.enum";
import { RegistrationModel } from 'app/models/Registration.model';
import { StorageService } from 'app/services/storage/local-storage';
import { TokenService } from 'app/services/token/token.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/services/auth-service/authentication.service';
import { SpinnerService } from 'app/shared-services/spinner.service';

@Injectable()
export class AccountService {
    public apiBaseUrl: string = this.config.getConfig("apiBaseUrl");
    public refreshTokenKey: string = this.config.getConfig("refresh_Token_key");

    constructor(private httpClient: HttpService,
        private authService: AuthenticationService,
        private appStorage: StorageService,
        public config: AppConfig,       
        private errService: ErrorService,
        private spinner: SpinnerService) {
    }

    getAccountDetail(): Observable<RegistrationModel> {
        let url = this.apiBaseUrl + this.config.getConfig("myAccountUrl");
        return this.httpClient.get(url).map(res => {
            let responseObject = res.text() ? res.json() : {};
            return responseObject;
        })
            .catch(this.errService.handleError);
    }

    getAccountActionCategories(): Observable<any> {
        //TODO :  Get it confirm from Nagesh that from where this value will come.
        let categories = [
            { id: AccountActionCategory.Change_Benificary, description: 'Change Benificary' },
            { id: AccountActionCategory.Change_Address, description: 'Change Mailing Address' },
            { id: AccountActionCategory.Change_Name, description: 'Change Name' },
            { id: AccountActionCategory.Change_Direct_Deposit, description: 'Authorize or change direct deposit' },
            { id: AccountActionCategory.Change_Mode_Premium_Payment, description: 'Change of mode premium payment' },
            { id: AccountActionCategory.Request_Duplicate_Annuity_Contract, description: 'Request a duplicate annuity contract' },
            { id: AccountActionCategory.Request_Duplicate_Life_Contract, description: 'Request a duplicate life contract' },
        ];
        return new Observable(observer => {
            observer.next(categories);
        });
    }

    logoutAccount() {
        this.spinner.start();
        let url = this.apiBaseUrl +'/' + this.config.getConfig("apiLogout");
        url = url.replace('{refreshToken}', this.appStorage.readKey(this.refreshTokenKey));
        this.httpClient.post(url, null).subscribe(res => {
            var response = res.text() ? res.json() : {};
            this.spinner.stop();
            if (response.isSuccess) {
                this.authService.logOutSuccessful();
            }
            else {
                //TODO : Need to discuss with Nagesh. meanwhile I m clearing it.
                this.authService.logOutSuccessful();
            }
        },
        error => {
            this.spinner.stop();
        });
    }
}