import { CurrencyPipe, DatePipe, Location } from '@angular/common';
import { Injectable } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { Http } from "@angular/http";
import { MatDialogModule, MatDialog, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { saveAs } from '@progress/kendo-file-saver';
import { AppConfig } from "app/configuration/app.config";
import { ErrorType } from "app/enums/error-type.enum";
import { PremiumType } from "app/enums/premium-type.enum";
import { ServiceDocumentType } from "app/enums/service-document-type.enum";
import { ServiceRequestType } from "app/enums/service-type.enum";
import { PolicyModel } from "app/models/policy.model";
import { ServiceRequestDisclosureModel } from "app/models/serviceRequestDisclosure.model";
import { ServiceRequestDocumentModel } from "app/models/serviceRequestDoument.model";
import { StorageService } from "app/services/storage/local-storage";
import { FglDialogComponent } from "app/shared-components/dialog.component/dialog.component";
import * as moment from 'moment';
import { DynamicPolicyInfoModel, DynamicField } from 'app/models/dynamicPolicyInfo.model';
import { Validation } from 'app/shared-services/validation.service';

@Injectable()
export class UtilityService {

    private returnUrlKey: string = this.appConfig.getConfig("sr_return_url_key");
    private simulatedUserKey: boolean = this.appConfig.getConfig("simulated_user_key");
    private simulatedUserPermissionsKey: string = this.appConfig.getConfig("simulated_user_permissions_key");

    public constructor(private httpClient: Http,
        private appConfig: AppConfig,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private appstorage: StorageService,
        private location: Location,
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe) { }

    public getServiceRequestDisplayName(serviceType: ServiceRequestType): string {
        if (serviceType == ServiceRequestType.None)
            return "";
        else if (serviceType == ServiceRequestType.ChangeBeneficiary)
            return this.getConfigText("sr_display_name_changeBeneficiary");
        else if (serviceType == ServiceRequestType.ChangeMailingAddress)
            return this.getConfigText("sr_display_name_changeMailAddress");
        else if (serviceType == ServiceRequestType.ChangeName)
            return this.getConfigText("sr_display_name_changeName");
        else if (serviceType == ServiceRequestType.TermLifeInsuranceCancellation)
            return this.getConfigText("sr_display_name_termLifeCancellation");
        else if (serviceType == ServiceRequestType.LifeLoan)
            return this.getConfigText("sr_display_name_lifeLoan");
        else if (serviceType == ServiceRequestType.ChangeAutomationPremiumBankInformation)
            return this.getConfigText("sr_display_name_changePremium");
        else if (serviceType == ServiceRequestType.InterestCreditingReallocation)
            return this.getConfigText("sr_display_name_interestCreditRellocation");
        else if (serviceType == ServiceRequestType.ChangePaymentMode)
            return this.getConfigText("sr_display_name_changePaymentMode");
        else if (serviceType == ServiceRequestType.DisbursementLifeInsurance)
            return this.getConfigText("sr_display_name_lifeSurrender");
        else if (serviceType == ServiceRequestType.RequestRequiredMinimumDistribution)
            return this.getConfigText("sr_display_name_RMD");
        else if (serviceType == ServiceRequestType.QualifiedDisbursementSystematicWithdrawl)
            return this.getConfigText("sr_display_name_annuityWithdrawals");
        else if (serviceType == ServiceRequestType.NonQualifiedDisbursementSystematicWithdrawl)
            return this.getConfigText("sr_display_name_nonQualAnnuityWithdrawal");
        else
            return "";
    }

    public isSsnNeedToDisplay(serviceType: ServiceRequestType): boolean {
        if (serviceType == ServiceRequestType.LifeLoan
            || serviceType == ServiceRequestType.DisbursementLifeInsurance
            || serviceType == ServiceRequestType.QualifiedDisbursementSystematicWithdrawl
            || serviceType == ServiceRequestType.NonQualifiedDisbursementSystematicWithdrawl
            || serviceType == ServiceRequestType.RequestRequiredMinimumDistribution)
            return true;
        else
            return false;
    }

    public isOwnerAddressNeedToDisplay(serviceType: ServiceRequestType): boolean {
        if (serviceType == ServiceRequestType.LifeLoan)
            return true;
        else if (serviceType == ServiceRequestType.DisbursementLifeInsurance)
            return true;
        else
            return false;
    }

    public getServiceRequestHeaderText(serviceType: ServiceRequestType, isNoneViewHdrText: boolean = false): string {
        if (serviceType == ServiceRequestType.None)
            return "";
        else if (serviceType == ServiceRequestType.ChangeBeneficiary) {
            if (isNoneViewHdrText)
                return this.getConfigText("changeBenefNoneViewHdrText");
            else
                return this.getConfigText("changeBenefViewHdrText");
        }
        else if (serviceType == ServiceRequestType.ChangeMailingAddress) {
            if (isNoneViewHdrText)
                return this.getConfigText("changeAddressNoneViewHdrText");
            else
                return "";
        }
        else if (serviceType == ServiceRequestType.ChangeName) {
            if (isNoneViewHdrText)
                return this.getConfigText("changeNameNoneViewHdrText");
            else
                return this.getConfigText("changeNameViewHdrText");
        }
        else if (serviceType == ServiceRequestType.TermLifeInsuranceCancellation) {
            if (isNoneViewHdrText)
                return this.getConfigText("tlicNoneViewHdrText");
            else
                return "";
        }
        else if (serviceType == ServiceRequestType.InterestCreditingReallocation) {
            if (isNoneViewHdrText)
                return this.getConfigText("indexCreditingReallocationNoneViewHdrText");
            else
                return "";
        }
        else
            return "";
    }

    public getServiceAgreementList(serviceType: ServiceRequestType, premiumType: number = null): ServiceRequestDisclosureModel[] {
        let authorizationChkBoxItems: ServiceRequestDisclosureModel[] = []
        let configText: string = "";

        if (serviceType == ServiceRequestType.None)
            return authorizationChkBoxItems;
        else if (serviceType == ServiceRequestType.TermLifeInsuranceCancellation) {
            authorizationChkBoxItems = this.getTermLifeInsuranceCancellationAgreements();
        }
        else if (serviceType == ServiceRequestType.ChangeBeneficiary) {
            configText = this.getConfigText("changeBenificiaryAgreementText");
        }
        else if (serviceType == ServiceRequestType.ChangeMailingAddress) {
            configText = this.getConfigText("changeMailingAddressAgreementText")
        }
        else if (serviceType == ServiceRequestType.ChangeName) {
            configText = this.getConfigText("changeNameAgreementText");
        }
        else if (serviceType == ServiceRequestType.ChangeAutomationPremiumBankInformation) {
            authorizationChkBoxItems = this.getChangeAutomationPremiumBankInfoAgreements();
        }
        else if (serviceType == ServiceRequestType.InterestCreditingReallocation) {
            configText = this.getConfigText("interest_crediting");
        }
        else if (serviceType == ServiceRequestType.ChangePaymentMode) {
            authorizationChkBoxItems = this.getChangePaymentModeAgreements(premiumType);
        }
        else if (serviceType == ServiceRequestType.LifeLoan) {
            authorizationChkBoxItems = this.getLifeLoanAgreements();
        }
        else if (serviceType == ServiceRequestType.DisbursementLifeInsurance) {
            authorizationChkBoxItems = this.getDisbursementLifeInsuranceAgreements();
        }
        else if (serviceType == ServiceRequestType.QualifiedDisbursementSystematicWithdrawl) {
            authorizationChkBoxItems = this.getQualifiedDisbursementSystematicWithdrawlAgreements();
        }
        else if (serviceType == ServiceRequestType.NonQualifiedDisbursementSystematicWithdrawl) {
            authorizationChkBoxItems = this.getNonQualifiedDisbursementSystematicWithdrawlAgreements();
        }
        else if (serviceType == ServiceRequestType.RequestRequiredMinimumDistribution) {
            authorizationChkBoxItems = this.getRMDAgreements();
        }
        else {
            configText = this.getConfigText("agreementText");
        }

        if (authorizationChkBoxItems.length <= 0)
            authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 1));

        return authorizationChkBoxItems;
    }

    public getOfflineServiceRequestDisplayName(serviceType: ServiceRequestType): string {
        if (serviceType == ServiceRequestType.None)
            return "";
        else if (serviceType == ServiceRequestType.ChangeBeneficiary)
            return this.getConfigText("sr_display_name_changeBeneficiary");
        else if (serviceType == ServiceRequestType.ChangeMailingAddress)
            return this.getConfigText("sr_display_name_changeMailAddress");
        else if (serviceType == ServiceRequestType.ChangeName)
            return this.getConfigText("sr_display_name_changeName");
        else if (serviceType == ServiceRequestType.TermLifeInsuranceCancellation)
            return this.getConfigText("sr_display_name_termLifeCancellation");
        else if (serviceType == ServiceRequestType.DuplicateLifeInsurancePolicy)
            return this.getConfigText("sr_display_name_duplicateLifePolicy");
        else if (serviceType == ServiceRequestType.LifeLoan)
            return this.getConfigText("sr_display_name_lifeLoan");
        else if (serviceType == ServiceRequestType.ChangeAutomationPremiumBankInformation)
            return this.getConfigText("sr_display_name_changePremium");
        else if (serviceType == ServiceRequestType.InterestCreditingReallocation)
            return this.getConfigText("sr_display_name_interestCreditRellocation");
        else if (serviceType == ServiceRequestType.ChangePaymentMode)
            return this.getConfigText("sr_display_name_changePaymentMode");
        else if (serviceType == ServiceRequestType.DisbursementLifeInsurance)
            return this.getConfigText("sr_display_name_lifeSurrender");
        else if (serviceType == ServiceRequestType.RequestRequiredMinimumDistribution)
            return this.getConfigText("sr_display_name_RMD");
        else if (serviceType == ServiceRequestType.QualifiedDisbursementSystematicWithdrawl)
            return this.getConfigText("sr_display_name_annuityWithdrawals");
        else if (serviceType == ServiceRequestType.NonQualifiedDisbursementSystematicWithdrawl)
            return this.getConfigText("sr_display_name_nonQualAnnuityWithdrawal");
        else if (serviceType == ServiceRequestType.InterestCreditingReallocationFIA)
            return this.getConfigText("sr_display_name_interestCreditingReallocationFIA");
        else
            return "";
    }

    public getConfigText(configKey: string): string {
        return this.appConfig.getConfig(configKey);
    }

    public readText(filePath: string) {
        this.httpClient.get(filePath).subscribe(data => {
            console.log(data.text());
        })
    }

    public openDialog(title: string,
        body: string,
        firstButtonCaption: string = "Ok",
        secondButtonCaption: string = "Cancel",
        isUserNotAuthorize: boolean = false,
        firstButtonValue: any = "1",
        secondButtonValue: any = "2") {
        let config = new MatDialogConfig();
        config.disableClose = true;
        let dialogRef: MatDialogRef<FglDialogComponent> = this.dialog.open(FglDialogComponent, config);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.body = body;
        dialogRef.componentInstance.firstButtonCaption = firstButtonCaption;
        dialogRef.componentInstance.firstButtonReturnValue = firstButtonValue;
        dialogRef.componentInstance.secondButtonCaption = secondButtonCaption;
        dialogRef.componentInstance.secondButtonReturnValue = secondButtonValue;
        dialogRef.componentInstance.isUserNotAuthorize = isUserNotAuthorize;
        return dialogRef.afterClosed().map(x => { return x; });
    }

    public getServiceDocumentContentType(documentType: ServiceDocumentType): string {
        if (documentType == ServiceDocumentType.doc)
            return "application/msword";
        else if (documentType == ServiceDocumentType.docx)
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        else if (documentType == ServiceDocumentType.pdf)
            return "application/pdf";
        else if (documentType == ServiceDocumentType.txt)
            return "text/plain";
        else if (documentType == ServiceDocumentType.xls)
            return "application/vnd.ms-excel";
        else if (documentType == ServiceDocumentType.xlsx)
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        else
            return "";
    }

    public getServiceRequestDocumentModel(serviceRequestType: ServiceRequestType): ServiceRequestDocumentModel[] {
        let result: ServiceRequestDocumentModel[] = [];
        if (serviceRequestType == ServiceRequestType.ChangeName) {
            result.push(new ServiceRequestDocumentModel(null, null, 1, "Legal evidence", "Legal evidence", ServiceDocumentType.pdf, null, this.getServiceDocumentContentType(ServiceDocumentType.pdf), null, "", 1));
        }
        else if (serviceRequestType == ServiceRequestType.ContactUs) {
            result.push(new ServiceRequestDocumentModel(null, null, 1, "Upload document", "Upload document", ServiceDocumentType.pdf, null, this.getServiceDocumentContentType(ServiceDocumentType.pdf), null, "", 1));
        }
        else if (serviceRequestType == ServiceRequestType.QualifiedDisbursementSystematicWithdrawl) {
            result.push(new ServiceRequestDocumentModel(null, null, 1, "Upload copy of void check or deposit slip here", "Upload Copy of Void check or deposit slip", ServiceDocumentType.pdf, null, this.getServiceDocumentContentType(ServiceDocumentType.pdf), null, "", 1));
        }
        else if (serviceRequestType == ServiceRequestType.RequestRequiredMinimumDistribution) {
            result.push(new ServiceRequestDocumentModel(null, null, 1, "Upload void check / deposit slip here", "Upload void check/deposit slip", ServiceDocumentType.pdf, null, this.getServiceDocumentContentType(ServiceDocumentType.pdf), null, "", 1));
        }
        return result;
    }

    public navigateUserToServiceRequest(policyOwnerCount, policyNumber, serviceType) {
        // MJD debugger;
        let navigationUrl: string = this.appConfig.getConfig('appServiceRequestUrlNavigation')
            .replace("{policyNumber}", policyNumber).replace("{serviceType}", serviceType);

        this.router.navigate([navigationUrl]);
    }

    public navigateToErrorPage(errorType: ErrorType, showHomeButton: boolean = false) {
        let navigationUrl: string = this.appConfig.getConfig('errorPage');

        navigationUrl = navigationUrl.replace('{code}', errorType.toString()).replace('{showHome}', String(showHomeButton));
        this.router.navigate([navigationUrl], { skipLocationChange: true });
    }

    public resetFormGroup(formGroup: FormGroup) {
        let control: AbstractControl = null;
        formGroup.reset();
        formGroup.markAsUntouched();
        Object.keys(formGroup.controls).forEach((name) => {
            control = formGroup.controls[name];
            control.setErrors(null);
        });
    }

    public convertUtcToLocalDate(value: string) {
        let utcTime = value;
        var utcText = moment(utcTime).format("L LT");

        // First way
        var offset = moment().utcOffset();
        var localText = moment.utc(utcTime).utcOffset(offset).format("L");

        return localText;
    }

    public convertUtcToLocalTime(value: string) {
        let utcTime = value;
        var offset = moment().utcOffset();
        var localTime = moment.utc(utcTime).utcOffset(offset).format("LT");
        return localTime;
    }

    public convertUtcDateToLocalDate(value: Date) {
        let utcTime = value;
        var utcText = moment(utcTime).format("L LT");

        // First way
        var offset = moment().utcOffset();
        var localText = moment.utc(utcTime).utcOffset(offset).format("L");

        return localText;
    }

    public convertUtcDateToLocalTime(value: Date) {
        let utcTime = value;
        var utcText = moment(utcTime).format("L LT");

        // First way
        var offset = moment().utcOffset();
        var localTime = moment.utc(utcTime).utcOffset(offset).format("LT");
        return localTime;
    }

    // public validatePolicy(policyDetail: PolicyModel): boolean {
    //     let errorType: ErrorType = ErrorType.None;
    //     if (policyDetail == null || policyDetail == undefined ||
    //         policyDetail.policyNumber == undefined || policyDetail.policyNumber == '')
    //         errorType = ErrorType.PolicyNotFound;
    //     else if (policyDetail.canPolicyDetailView != undefined && !policyDetail.canPolicyDetailView)
    //         errorType = ErrorType.PolicyCanNotView;

    //     if (errorType == ErrorType.None)
    //         return true;
    //     else {
    //         return false;
    //     }
    // }

    public validateDynamicPolicy(dynamicPolicyInfoModel: DynamicPolicyInfoModel) {

        let fieldProperty: DynamicField[] = dynamicPolicyInfoModel.dynamicFields;

        let errorType: ErrorType = ErrorType.None;
        if (dynamicPolicyInfoModel == null || dynamicPolicyInfoModel == undefined ||
            dynamicPolicyInfoModel.policyNumber == undefined || dynamicPolicyInfoModel.policyNumber == '')
            errorType = ErrorType.PolicyNotFound;
        else if (dynamicPolicyInfoModel.isPolicyDetailCanBeView != undefined && !dynamicPolicyInfoModel.isPolicyDetailCanBeView)
            errorType = ErrorType.PolicyCanNotView;

        if (errorType == ErrorType.None)
            return true;
        else {
            return false;
        }
    }


    public validatePolicyList(policyDetail: PolicyModel): boolean {
        let errorType: ErrorType = ErrorType.None;
        if (policyDetail == null || policyDetail == undefined ||
            policyDetail[0] == undefined || policyDetail[0].policyNumber == undefined || policyDetail[0].policyNumber == '')
            errorType = ErrorType.PolicyNotFound;
        else if (policyDetail.canPolicyDetailView != undefined && !policyDetail.canPolicyDetailView)
            errorType = ErrorType.PolicyCanNotView;

        if (errorType == ErrorType.None)
            return true;
        else {
            return false;
        }
    }

    public validateServiceRequest(serviceRequestDetail: any, isRequestAllowed: boolean): boolean {
        let errorType: ErrorType = ErrorType.None;
        if (serviceRequestDetail == null || serviceRequestDetail == undefined || serviceRequestDetail.length <= 0 || !isRequestAllowed)
            errorType = ErrorType.InvalidServiceRequestForPolicy;

        if (errorType == ErrorType.None)
            return true;
        else {
            return false;
        }
    }

    private getChangeAutomationPremiumBankInfoAgreements(): ServiceRequestDisclosureModel[] {
        let authorizationChkBoxItems: ServiceRequestDisclosureModel[] = []
        let configText: string = '';

        configText = this.getConfigText("change_automatic_premium");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 1));

        configText = this.getConfigText("agreementTextUpdated");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 2));

        return authorizationChkBoxItems;
    }

    private getChangePaymentModeAgreements(premiumType: PremiumType): ServiceRequestDisclosureModel[] {
        let authorizationChkBoxItems: ServiceRequestDisclosureModel[] = []
        let configText: string = '';

        if (premiumType == PremiumType.ChangedPremium) {
            configText = this.getConfigText("changePayMode_Planned_Premium_AgreementText");
            authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 1));
        }
        else if (premiumType == PremiumType.ChangedPremiumMonthly) {
            configText = this.getConfigText("changePayMode_IAuthorizedPaymentOfDebits_AgreementText");
            authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 1));
            configText = this.getConfigText("changePayMode_IAffirmThat_AgreementText");
            authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 2));
        }
        else if (premiumType == PremiumType.Premium) {
            configText = this.getConfigText("changePayMode_IAffirmThat_AgreementText");
            authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 1));
        }
        return authorizationChkBoxItems;
    }

    private getLifeLoanAgreements(): ServiceRequestDisclosureModel[] {
        let authorizationChkBoxItems: ServiceRequestDisclosureModel[] = []
        let configText: string = '';

        configText = this.getConfigText("lifeloanagreementText_affirms");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 1));

        configText = this.getConfigText("lifeloan_underPenalities");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 2));

        configText = this.getConfigText("lifeloanagreementText");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 3));

        return authorizationChkBoxItems;
    }

    private getDisbursementLifeInsuranceAgreements(): ServiceRequestDisclosureModel[] {
        let authorizationChkBoxItems: ServiceRequestDisclosureModel[] = []
        let configText: string = '';

        configText = this.getConfigText("life_disbursemnet_underPenalitiesOfPerjury");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 1));

        configText = this.getConfigText("agreementText");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 2));

        return authorizationChkBoxItems;
    }

    private getQualifiedDisbursementSystematicWithdrawlAgreements(): ServiceRequestDisclosureModel[] {
        let authorizationChkBoxItems: ServiceRequestDisclosureModel[] = []
        let configText: string = '';

        configText = this.getConfigText("qualified_annuity_IAffirms_Text");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 1));

        configText = this.getConfigText("qualified_annuity_Agreement_Text");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 2));

        return authorizationChkBoxItems;
    }

    private getNonQualifiedDisbursementSystematicWithdrawlAgreements(): ServiceRequestDisclosureModel[] {
        let authorizationChkBoxItems: ServiceRequestDisclosureModel[] = []
        let configText: string = '';

        configText = this.getConfigText("non_qualified_annuity_IAffirms_Text");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 1));

        configText = this.getConfigText("qualified_annuity_Agreement_Text");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 2));

        return authorizationChkBoxItems;
    }

    private getTermLifeInsuranceCancellationAgreements(): ServiceRequestDisclosureModel[] {
        let authorizationChkBoxItems: ServiceRequestDisclosureModel[] = []
        let configText: string = '';

        configText = this.getConfigText("tlicagreementText");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 1));

        configText = this.getConfigText("haveread_text");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 2));

        return authorizationChkBoxItems;
    }

    private getRMDAgreements(): ServiceRequestDisclosureModel[] {
        let authorizationChkBoxItems: ServiceRequestDisclosureModel[] = []
        let configText: string = '';

        configText = this.getConfigText("SR_Online_RMD_I_Affirms");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 1));

        configText = this.getConfigText("SR_Online_RMD_I_Certify_SSN");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 2));

        configText = this.getConfigText("agreementTextUpdated");
        authorizationChkBoxItems.push(new ServiceRequestDisclosureModel(configText, false, 3));

        return authorizationChkBoxItems;
    }

    public navigateOnCancelServiceRequest() {
        var url = this.appstorage.readKey(this.returnUrlKey);
        this.appstorage.removeKey(this.returnUrlKey);
        if (url != "")
            this.router.navigate([url]);
        else
            this.location.back();
    }

    public saveReturnUrlForCancelServiceRequestNavigation() {
        this.appstorage.saveKey(this.returnUrlKey, this.router.url);
    }

    //Check if simulated user has requested permission
    public isSimulatedUserHasPermission(permission: string) {
        var isSimulatedUser = this.appstorage.readKey(this.simulatedUserKey);
        if (isSimulatedUser == "true") {
            var simulatedUserPermissions = this.appstorage.readKey(this.simulatedUserPermissionsKey);
            if (simulatedUserPermissions) {
                if (simulatedUserPermissions.indexOf(permission) > -1)
                    return true;
                else
                    return false;
            }
            else
                return false;
        }
        return true;
    }

    // this function is used to open pdf document in new tab
    public downloadDocument(res: any, fileCode: any, win: any, proxyTarget: string) {
        if (res.isSuccess) {
            let proxyApiPath = this.appConfig.getConfig("apiBaseUrl") + this.appConfig.getConfig("savePdfDocument");
            let dataURI = "data:application/pdf;base64," + res.data;

            saveAs(dataURI, fileCode + ".pdf", {
                forceProxy: true,
                proxyURL: proxyApiPath,
                proxyTarget: proxyTarget,
            });
        }
        else {
            if (navigator.platform.match(/Android/i)) {
                win.close();
            }
            this.openDialog("Download", this.appConfig.getConfig('download_error'), "", "Ok").subscribe(x => { });
        }
    }

    //This method returns the radio button text which has been selected during the Service Request creation.
    //The text for the radio buttons have been kept with the following key format in the config json.
    //{ServiceRequestType}_{ModelPropertyName}_{SelectedOption}. Example rmd_paymentOption_1
    public GetSelectedOptionText(modelData: object, requestType: string) {
        Object.keys(modelData).map((propertyName) => {
            if (propertyName)
                modelData[propertyName] = this.GetConfigText(requestType, propertyName, modelData[propertyName]);
        });
    }

    private GetConfigText(requestType: string, propertyName: string, propertyValue: any): string {
        try {
            let textContent;
            if (!isNaN(propertyValue)) {
                textContent = this.appConfig.getConfig(requestType + '_' + propertyName + '_' + propertyValue);
            }
            if (textContent)
                return textContent;
        }
        catch (e) { }

        return propertyValue;
    }

    public TransformToDateFormat(value: Date): string {
        let formatedDate = this.datePipe.transform(value, this.appConfig.getConfig('date_format'))
        return formatedDate;
    }

    public TransformToCurrencyFormat(value: number): string {
        let formatedAmount = this.currencyPipe.transform(value, 'USD', true, '2.2-4');
        return formatedAmount;
    }

    public TransformToCurrencyFormatWithoutDollarSign(value: number): string {
        let formatedAmount = this.currencyPipe.transform(value, 'USD', true, '2.2-4');
        formatedAmount = formatedAmount.substring(1, formatedAmount.length);
        return formatedAmount;
    }

    //Generate random numbers 
    public getGuid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + '_' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4();
    }

    public RemoveExtraDecimalAndLeadingZero(modelPropertyValue: any) {
        if (!modelPropertyValue) {
            return "0";
        }
        let numDecimals: number = modelPropertyValue % 1 === 0 ? 0 : 2;
        let returnValue = !isNaN(parseFloat(modelPropertyValue.toString())) &&
            parseFloat(modelPropertyValue.toString()) > 0.00 ?
            parseFloat(modelPropertyValue.toString()).toFixed(numDecimals).toString() :
            parseFloat("0").toFixed(numDecimals).toString();

        return returnValue;
    }

    public ChkValidateNumberWithDecimalAndLeadingZeroOnBlur(element: any, modelPropertyValue: any, formControl: any, form: any) {
        if (element.target.value == "") modelPropertyValue = 0;
        element.target.value = this.RemoveExtraDecimalAndLeadingZero(modelPropertyValue);

        let benefit = formControl;
        formControl.setValue(element.target.value);

        if (modelPropertyValue.toString() === "100.") {
            benefit.setValidators(null);
            benefit.setErrors(null);
            Validation.ValidateForm(form);
        }
    }

    public ChkValidationsOnFocus(formControl: any, form: any, validations: any) {
        formControl.setValidators(validations);
        Validation.ValidateForm(form);
    }

    public ValidateWithHoldITValueBtwFederalAndState(form: FormGroup, withHoldValidations: any[]): {} {
        let isValidWithHold = true;
        let errorMessage = null;
        let controls = form.controls;
        let withholdFederalIncomeTaxControl = controls["withholdFederalIncomeTax"];
        let withholdStateIncomeTaxControl = controls["withholdStateIncomeTax"];
        let residenceStateControl = controls["residenceState"];
        let stateValue = parseFloat(this.RemoveExtraDecimalAndLeadingZero(withholdStateIncomeTaxControl.value));
        let federalValue = parseFloat(this.RemoveExtraDecimalAndLeadingZero(withholdFederalIncomeTaxControl.value));

        let total = parseFloat(this.RemoveExtraDecimalAndLeadingZero((stateValue + federalValue).toString()));

        if (total === 100) {
            errorMessage = null;
        }
        else if (total > 100) {
            errorMessage = "The combined total of Federal and State withholdings must not be greater than 100";
            isValidWithHold = false;
        }
        else if (total < 100) {
            isValidWithHold = true;
        }

        if (federalValue <= 100) {
            if (!withholdStateIncomeTaxControl.value || withholdStateIncomeTaxControl.value === '0') {
                withholdStateIncomeTaxControl.setValidators(null);
                residenceStateControl.setValidators(null);
                this.EmptyControls([residenceStateControl]);
            }
            else {
                withholdStateIncomeTaxControl.setValidators(withHoldValidations);
                residenceStateControl.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            }
        }
        if (stateValue <= 100) {
            if (!withholdFederalIncomeTaxControl.value || withholdFederalIncomeTaxControl.value === '0') {
                withholdFederalIncomeTaxControl.setValidators(null);
                residenceStateControl.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
                this.MarkControlsDirty([controls["withholdFederalIncomeTax"], controls["residenceState"]]);
            }
            else {
                withholdFederalIncomeTaxControl.setValidators(withHoldValidations);
            }
        }
        if (total === 0) {
            withholdFederalIncomeTaxControl.setValidators(withHoldValidations);
            withholdStateIncomeTaxControl.setValidators(withHoldValidations);
            residenceStateControl.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            if (!isNaN(parseFloat(withholdFederalIncomeTaxControl.value)) || !isNaN(parseFloat(withholdStateIncomeTaxControl.value)))
                errorMessage = "The combined total of Federal and State withholdings must be greater than zero.";
        }

        return { IsValidWithHold: isValidWithHold, ErrorMessage: errorMessage };
    }

    public MarkControlsDirty(controlList: any) {
        controlList.forEach(control => {
            control.markAsTouched();
        });
    }

    public EmptyControls(controlList: any) {
        controlList.forEach(control => {
            control.setValue(null);
        });
    }

    public enableControls(controlList: any) {
        controlList.forEach(control => {
            control.enable();
        });
    }
    public disableControls(controlList: any) {
        controlList.forEach(control => {
            control.disable();
        });
    }

    public removeControlsValidators(controlList: any) {
        controlList.forEach(control => {
            control.setValidators(null);
        });
    }

    public resetResidenceState(withholdStateIncomeTax: AbstractControl, residenceState: AbstractControl) {
        let stateControlValue = ((withholdStateIncomeTax != undefined || withholdStateIncomeTax != null)
            && (withholdStateIncomeTax.value != null && withholdStateIncomeTax.value != ""))
            ? parseFloat(withholdStateIncomeTax.value) : null;

        if (stateControlValue != null && stateControlValue > 0) {
            this.MarkControlsDirty([residenceState]);
            residenceState.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            this.enableControls([residenceState]);
        }
        else {
            this.EmptyControls([residenceState]);
            this.removeControlsValidators([residenceState]);
            this.disableControls([residenceState]);
        }
    }
}