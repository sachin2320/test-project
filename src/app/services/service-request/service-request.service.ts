import { Injectable } from '@angular/core';
import { AppConfig } from "app/configuration/app.config";
import { PolicyUsageIndicator } from 'app/enums/policy-usage-indicator.enum';
import { SystematicWithdrawalType } from 'app/enums/service-request-qualified-nonQualified.enum';
import { ServiceRequestUsageIndicator } from 'app/enums/service-request-usage-indicator.enum';
import { ServiceRequestType } from "app/enums/service-type.enum";
import { SurrenderType } from 'app/enums/surrender-type.enum';
import { Beneficiary } from "app/models/beneficiary.model";
import { ServiceRequestModel } from "app/models/serviceRequest.model";
import { ServiceRequestChangeAddressModel } from "app/models/serviceRequestChangeAddress.model";
import { ServiceRequestChangeNameModel } from "app/models/serviceRequestChangeName.model";
import { ServiceRequestFieldDetailModel } from "app/models/serviceRequestFieldDetail.model";
import { ServiceRequestNonQualifiedDisbursementSystematicWithdrawalModel } from 'app/models/serviceRequestNonQualified.model';
import { ServiceRequestQualifiedDisbursementSystematicWithdrawalModel } from 'app/models/serviceRequestQualified.model';
import { UtilityService } from 'app/services/helper/utility.service';
import { HttpService } from "app/services/http/http.service";
import { ErrorService } from "app/shared-services/error.service";
import { Observable } from "rxjs/Rx";
import { PaymentOption } from 'app/enums/payment-option.enum';
import { PaymentType } from 'app/enums/payment-type.enum';
import { NoElectionType } from 'app/enums/election-type.enum';
import { PartialSurrenderType } from 'app/enums/partial-surrender-type.enum';
import { ServiceRequestLifeDisbursementModel } from 'app/models/serviceRequestLifeDisbursement.model';

@Injectable()
export class ServiceRequestService {
    apiBaseUrl: string = this.config.getConfig("apiBaseUrl");

    constructor(private utility: UtilityService,
        private httpClient: HttpService,
        public config: AppConfig,
        private errService: ErrorService) { }

    getTicketList(indicator: ServiceRequestUsageIndicator): Observable<ServiceRequestModel[]> {
        let url = this.apiBaseUrl + this.config.getConfig("userTicketList").toString().replace("{usageIndicator}", indicator);
        return this.httpClient.get(url).map(res => {
            let resJson = res.text() ? res.json().data.tickets : {};
            let result: ServiceRequestModel[] = Object.keys(resJson).map((key) => {
                let response = new ServiceRequestModel();
                response.requestXRefId = resJson[key].id;
                response.policyNumber = resJson[key].policyNumber;
                response.requestSubject = resJson[key].subject;
                response.submittedDate = resJson[key].createdAt;
                response.requestStatus = resJson[key].status;
                return response;
            });
            return result;
        })
            .catch(this.errService.handleError);
    }

    submitServiceRequest(model: FormData) {
        let url = this.apiBaseUrl + this.config.getConfig("serviceRequestSubmitUrl");
        return this.httpClient.postFormData(url, model, null, true).map(res => {
            let resJson = res.text() ? res.json() : {};
            return resJson;
        })
            .catch(this.errService.handleError);
    }

    submitOfflineServiceRequest(model: FormData) {
        let url = this.apiBaseUrl + this.config.getConfig("offlineServiceRequestSubmitUrl");
        return this.httpClient.postFormData(url, model, null, true).map(res => {
            let resJson = res.text() ? res.json() : {};
            return resJson;
        })
            .catch(this.errService.handleError);
    }

    submitServiceRequestComment(zenDeskRequestId: number, userComment: string) {
        let url = this.apiBaseUrl + this.config.getConfig("serviceRequestAddCommentUrl");
        return this.httpClient.post(url, { "requestXRefId": zenDeskRequestId, "UserComment": userComment }, null, true).map(res => {
            let resJson = res.text() ? res.json() : {};
            return resJson;
        })
            .catch(this.errService.handleError);
    }

    getServiceRequestDetails(requesId: number = 0, zenDeskRefId: number = 0) {
        let url = (this.apiBaseUrl + this.config.getConfig("userServiceRequestDetailList")).replace("{id}", requesId.toString()).replace("{xrefId}", zenDeskRefId.toString());
        return this.httpClient.get(url).map(res => {
            let resJson = res.text() ? res.json() : [];
            return resJson;
        })
            .catch(this.errService.handleError);
    }

    getZendeskRequestDetails(zenDeskRefId: number) {
        let url = (this.apiBaseUrl + this.config.getConfig("serviceRequestZenDeskTicketDetails")).replace("{zenddeskId}", zenDeskRefId.toString());
        return this.httpClient.get(url).map(res => {
            let resJson = res.text() ? res.json() : [];
            return resJson;
        })
            .catch(this.errService.handleError);
    }

    getServiceRequestTypes(policyNumber: string, serviceTypeId: number = null) {
        let url = this.apiBaseUrl + this.config.getConfig("serviceRequestTypeUrl") + '/' + policyNumber;
        if (serviceTypeId)
            url = url + "/" + serviceTypeId.toString();

        return this.httpClient.get(url).map(res => {
            let resJson = res.text() ? res.json() : {};
            return resJson;
        })
            .catch(this.errService.handleError);
    }

    getServiceRequestDownloadFile(fileCode: string, openDocInNewTab: boolean): Observable<any> {
        let url = String(this.apiBaseUrl + this.config.getConfig("serviceRequestDownloadFileUrl"))
            .replace("{fileCode}", fileCode).replace("{openDocInNewTab}", openDocInNewTab.toString());
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

    getServiceRequestPolicyList(indicator: PolicyUsageIndicator, policyNumber: string = ""): Observable<any> {
        let url = this.apiBaseUrl + this.config.getConfig("serviceRequestPolListUrl").replace("{indicator}", indicator);
        if (policyNumber != "")
            url = url + "/" + policyNumber;

        return this.httpClient.get(url).map(res => {
            let responseObject = res.text() ? res.json() : {};
            return responseObject;
        })
            .catch(this.errService.handleError);
    }

    prepareServiceRequestSaveModel(requestType: ServiceRequestType,
        polNumber: string,
        isOnlineRequest: boolean,
        bodyData: any,
        footerData: any,
        headerData: any,
        bodyHtml: string): ServiceRequestModel {
        if (isOnlineRequest)
            return this.getOnlineServiceSaveModel(polNumber, isOnlineRequest, bodyData, footerData, headerData, requestType, bodyHtml);
        else
            return this.getDownloadServiceSaveModel(polNumber, isOnlineRequest, bodyData, footerData, headerData, requestType, bodyHtml);
    }

    private getRequestFieldModel(model: any,
        groupId: number,
        groupName: string,
        groupDisplayOrder: number,
        requestType: ServiceRequestType): ServiceRequestFieldDetailModel[] {
        let requestDetails: ServiceRequestFieldDetailModel[] = [];

        Object.keys(model).map((key) => {
            requestDetails.push(new ServiceRequestFieldDetailModel(key, model[key], groupId, groupName, groupDisplayOrder, this.getColumnDisplayOrder(requestType, key)));
        });
        return requestDetails;
    }

    private getDownloadServiceSaveModel(polNumber: string,
        isOnlineRequest: boolean,
        bodyData: any,
        footerData: any,
        headerData: any,
        requestType: ServiceRequestType,
        serviceRequestHTML: string): ServiceRequestModel {
        let requestDetails: ServiceRequestFieldDetailModel[] = [];

        if (requestType == ServiceRequestType.ChangePaymentMode) {
            let data = bodyData;
            let mergeRec = requestDetails.concat(this.getRequestFieldModel(data, 1, "UPM", 1, requestType));
            requestDetails = mergeRec;
        }

        let model = new ServiceRequestModel();
        model.requestTypeId = Number(requestType);
        model.policyNumber = polNumber;
        model.isOnline = isOnlineRequest;
        model.requestDetails = requestDetails;
        model.serviceRequestHTML = serviceRequestHTML;
        return model;
    }

    private getOnlineServiceSaveModel(polNumber: string,
        isOnlineRequest: boolean,
        bodyData: any,
        footerData: any,
        headerData: any,
        requestType: ServiceRequestType,
        serviceRequestHTML: string): ServiceRequestModel {
        let requestDetails: ServiceRequestFieldDetailModel[] = [];

        if (requestType == ServiceRequestType.ChangeBeneficiary) {
            let primamryBenficiaries = bodyData.PrimaryBeneficiaries;
            let contingentBenficiaries = bodyData.ContingentBeneficiaries;

            primamryBenficiaries.forEach(element => {
                let data = Object.assign({}, element);
                this.transformChangeBeneficiaryData(data);
                let mergeRec = requestDetails.concat(this.getRequestFieldModel(data, 1, "PB", 1, requestType));
                requestDetails = mergeRec;
            });
            contingentBenficiaries.forEach(element => {
                let data = Object.assign({}, element);
                this.transformChangeBeneficiaryData(data);
                let mergeRec = requestDetails.concat(this.getRequestFieldModel(data, 2, "CB", 2, requestType));
                requestDetails = mergeRec;
            });
        }
        else if (requestType == ServiceRequestType.ChangeName) {
            let modelData = Object.assign({}, bodyData.ChangeNameData);

            modelData.changeNameFor = modelData.isInsured == "true" ? this.utility.getConfigText("insuredOrAnnuitant") : this.utility.getConfigText("owner");

            delete modelData.isInsured;

            let mergeRec = requestDetails.concat(this.getRequestFieldModel(modelData, 1, "CN", 1, requestType));
            requestDetails = mergeRec;
        }
        else if (requestType == ServiceRequestType.ChangeMailingAddress) {
            let modelData = Object.assign({}, bodyData.ChangeNameData);

            modelData.changeMailingAddressFor = modelData.isInsured == "true" ? this.utility.getConfigText("insuredOrAnnuitant") : this.utility.getConfigText("owner");

            delete modelData.isInsured;

            let mergeRec = requestDetails.concat(this.getRequestFieldModel(modelData, 1, "CA", 1, requestType));
            requestDetails = mergeRec;
        }
        else if (requestType == ServiceRequestType.TermLifeInsuranceCancellation) {
            let data = Object.assign({}, bodyData.TLICData);

            if (data.isCancellationImmediate != undefined) {
                data.cancellationType = (data.isCancellationImmediate == "true") ? this.utility.getConfigText("term_cancellation_option_immediately") : this.utility.getConfigText("term_cancellation_option_on_date");
            }
            delete data.isCancellationImmediate;
            if (!data.effectiveDate) {
                delete data.effectiveDate;
            }

            let mergeRec = requestDetails.concat(this.getRequestFieldModel(data, 1, "TLIC", 1, requestType));
            requestDetails = mergeRec;
        }
        else if (requestType == ServiceRequestType.InterestCreditingReallocation) {
            let data = bodyData.IcrData;
            let mergeRec = requestDetails.concat(this.getRequestFieldModel(data, 1, "ICR", 1, requestType));
            requestDetails = mergeRec;
        }
        else if (requestType == ServiceRequestType.LifeLoan) {
            let data = Object.assign({}, bodyData.LifeLoanData);

            if (data.isAddressSame != undefined) {
                data.ownersAddress = data.isAddressSame == "true" ? this.utility.getConfigText("loan_owners_address_same") : this.utility.getConfigText("loan_owners_address_new");
                data.country = data.isAddressSame == "true" ? null : data.country;
            }

            if (data.isLoanDeliveryStandard != undefined) {
                data.loanDeliveryType = data.isLoanDeliveryStandard == "true" ? this.utility.getConfigText("loan_delivery_option_standard") : this.utility.getConfigText("loan_delivery_option_overnight");
            }

            if (data.isLoanAmountRequestMaximum != undefined) {
                data.loanAmountRequest = data.isLoanAmountRequestMaximum == "true" ? this.utility.getConfigText("loan_amount_request_maximum") : this.utility.getConfigText("loan_amount_request_specific") + " " + this.utility.TransformToCurrencyFormatWithoutDollarSign(data.specificLoanAmount);
            }

            if (data.isLoanTypeFixed != undefined) {
                data.loanType = data.isLoanTypeFixed == "true" ? this.utility.getConfigText("loan_type_fixed") : this.utility.getConfigText("loan_type_variable");
            }

            delete data.isAddressSame;
            delete data.isLoanDeliveryStandard;
            delete data.isLoanAmountRequestMaximum;
            delete data.isLoanTypeFixed;
            delete data.specificLoanAmount;

            let mergeRec = requestDetails.concat(this.getRequestFieldModel(data, 1, "LOAN", 1, requestType));
            requestDetails = mergeRec;
        }
        else if (requestType == ServiceRequestType.ChangeAutomationPremiumBankInformation) {
            let data = Object.assign({}, bodyData.AutomationPremiumBankInformationData);
            data.isPayorDifferentThanPolicyOwner = this.config.getConfig("capbi_isPayorDifferent_" + (data.isPayorDifferent == "true" ? 1 : 0));
            data.accountType = this.config.getConfig("capbi_isAccountTypeCheckings_" + (data.isAccountTypeCheckings == "true" ? 1 : 0));
            delete data.isPayorDifferent;
            delete data.isAccountTypeCheckings;

            let mergeRec = requestDetails.concat(this.getRequestFieldModel(data, 1, "CAPBI", 1, requestType));
            requestDetails = mergeRec;
        }
        else if (requestType == ServiceRequestType.ChangePaymentMode) {
            let data = Object.assign({}, bodyData.UpdatePaymentModeData);
            data.premiumPlanned = this.utility.TransformToCurrencyFormat(data.premiumPlanned);
            data.isPayorDifferentThanPolicyOwner = this.config.getConfig("upm_isPayorDifferent_" + (data.isPayorDifferentThanPolicyOwner == "true" ? 1 : data.isPayorDifferentThanPolicyOwner == "false" ? 2 : ''));

            data.confirmRoutingNumber = data.confirmRoutingNumber ? data.confirmRoutingNumber : null;
            data.confirmAccountNumber = data.confirmAccountNumber ? data.confirmAccountNumber : null;

            this.utility.GetSelectedOptionText(data, 'upm');

            let mergeRec = requestDetails.concat(this.getRequestFieldModel(data, 1, "UPM", 1, requestType));
            requestDetails = mergeRec;
        }
        else if (requestType == ServiceRequestType.QualifiedDisbursementSystematicWithdrawl) {
            let data = Object.assign({}, bodyData.QualifiedDisbursementSystematicWithdrawlData);
            this.transformQualifiedNonQualifiedSerivceRequestData(data, "qasw");
            let mergeRec = requestDetails.concat(this.getRequestFieldModel(data, 1, "QASW", 1, requestType));
            requestDetails = mergeRec;
        }
        else if (requestType == ServiceRequestType.NonQualifiedDisbursementSystematicWithdrawl) {
            let data = Object.assign({}, bodyData.NonQualifiedDisbursementSystematicWithdrawlData);
            this.transformQualifiedNonQualifiedSerivceRequestData(data, "nqasw");
            let mergeRec = requestDetails.concat(this.getRequestFieldModel(data, 1, "NQASW", 1, requestType));
            requestDetails = mergeRec;
        }
        else if (requestType == ServiceRequestType.RequestRequiredMinimumDistribution) {          
            let modelData = Object.assign({}, bodyData.RMDData);
            modelData.fairMarketValue = this.utility.TransformToCurrencyFormat(modelData.fairMarketValue);

            let paymentOptionText = this.config.getConfig('rmd_paymentOption_' + modelData.paymentOption);
            if (PaymentOption.OwnCalculation ==  modelData.paymentOption) {
                modelData.paymentOption = paymentOptionText + ' ' + this.utility.TransformToCurrencyFormat(modelData.ownCalculationDollarAmt);
            }
            if (PaymentOption.JointLifeExpectancy == modelData.paymentOption) {
                modelData.paymentOption = paymentOptionText + ' ' + this.utility.TransformToDateFormat(modelData.jointLifeExpectancyDob);
            }

            if (!modelData.withholdFederalIncomeTax && !modelData.withholdStateIncomeTax) {
                modelData.currenySignFederal = null;
                modelData.currenySignState = null;
            }

            if (modelData.incomeTaxWithhold === this.config.getConfig("election_of_tax_with_holding_elect")) {
                modelData.withholdFederalIncomeTax = this.utility.TransformToCurrencyFormatWithoutDollarSign(modelData.withholdFederalIncomeTax);
                modelData.withholdStateIncomeTax = this.utility.TransformToCurrencyFormatWithoutDollarSign(modelData.withholdStateIncomeTax);
            }

            if (modelData.noElectionType == NoElectionType.None) {
                modelData.noElectionType = null;
            }

            if (modelData.paymentType == PaymentType.ChequePayment) {
                modelData.accountType = null;
            }

            delete modelData.ownCalculationDollarAmt;
            delete modelData.jointLifeExpectancyDob;

            this.utility.GetSelectedOptionText(modelData, 'rmd');

            let mergeRec = requestDetails.concat(this.getRequestFieldModel(modelData, 1, 'RMD', 1, requestType));
            requestDetails = mergeRec;
        }
        else if (requestType == ServiceRequestType.DisbursementLifeInsurance) {
            let data = Object.assign({}, bodyData.DisbursementLifeInsuranceData);
            this.transformDisbursementOfLifeInsuranceServiceRequestData(data);
            let mergeRec = requestDetails.concat(this.getRequestFieldModel(data, 1, "DLI", 1, requestType));
            requestDetails = mergeRec;
        }

        let model = new ServiceRequestModel();
        model.requestTypeId = Number(requestType);
        model.policyNumber = polNumber;
        model.isOnline = isOnlineRequest;
        if (bodyData.Subject != undefined)
            model.subject = bodyData.Subject;
        model.userComment = bodyData.UserComment;
        model.requestDetails = requestDetails;
        model.serviceRequestHTML = serviceRequestHTML;
        model.ownerInitials = footerData.ownerInitials;
        model.ownerLast4Ssn = footerData.last4DigitSsn;
        model.ownerDob = footerData.ownerDob;
        model.isAgreementAccepted = footerData.isAgreementAccepted;
        model.acceptedAgreementText = footerData.agreementText;
        model.requestDisclosure = footerData.authorizationChkBoxItems;
        model.socialSecurityNumber = headerData.ssn;
        return model;
    }

    private getColumnDisplayOrder(requestType: ServiceRequestType, columnName: string): number {
        if (requestType == ServiceRequestType.ChangeBeneficiary) {
            return new Beneficiary().getDisplayOrder(columnName);
        }
        else if (requestType == ServiceRequestType.ChangeName) {
            return new ServiceRequestChangeNameModel().getDisplayOrder(columnName);
        }
        else if (requestType == ServiceRequestType.ChangeMailingAddress) {
            return new ServiceRequestChangeAddressModel().getDisplayOrder(columnName);
        }
        else if (requestType == ServiceRequestType.QualifiedDisbursementSystematicWithdrawl) {
            return new ServiceRequestQualifiedDisbursementSystematicWithdrawalModel().getDisplayOrder(columnName);
        }
        else if (requestType == ServiceRequestType.NonQualifiedDisbursementSystematicWithdrawl) {
            return new ServiceRequestNonQualifiedDisbursementSystematicWithdrawalModel().getDisplayOrder(columnName);
        }
        else if (requestType == ServiceRequestType.DisbursementLifeInsurance) {
            return new ServiceRequestLifeDisbursementModel().getDisplayOrder(columnName);
        }
        return -1;
    }

    getServiceRequestInterestCredit(policyNumber: string) {
        let url = (this.apiBaseUrl + this.config.getConfig("serviceRequestInterestCreditUrl")).replace("{policyNumber}", policyNumber);
        return this.httpClient.get(url).map(res => {
            let resJson = res.text() ? res.json() : [];
            return resJson;
        })
            .catch(this.errService.handleError);
    }

    //Below method is used to transform model key and values for Full or Partial Surrender of Life Insurance service request .
    transformDisbursementOfLifeInsuranceServiceRequestData(data: any) {
        if (data.surrenderType == SurrenderType.Partial) {
            let partialSurrenderTypeText = this.config.getConfig("dli_partialSurrenderType_" + data.partialSurrenderType);

            if (data.partialSurrenderType == PartialSurrenderType.PartialSurrenderAmount) {
                data.selectedPartialSurrenderAmount = partialSurrenderTypeText + ' ' + this.utility.TransformToCurrencyFormat(data.partialSurrenderAmount);
            } else {
                data.selectedPartialSurrenderAmount = partialSurrenderTypeText;
            }
            data.selectedPartialSurrenderAmountType = this.config.getConfig("dli_isGrossAmountForPartialSurrender_" + (data.isGrossAmountForPartialSurrender == "true" ? 1 : 0));
            delete data.nameOfAssignee;
            delete data.dateOfAssignment;
            delete data.isPolicyOrInterestTransferred;
        }
        else {
            data.returnPolicyType = this.config.getConfig("dli_isAgreeToReturnPolicyByEmail_" + (data.isAgreeToReturnPolicyByEmail == "true" ? 1 : 0));
            data.agreeToSurrenderCharges = data.isAgreeForFullSurrenderCharges == true ? this.config.getConfig("dli_isAgreeForFullSurrenderCharges_1") : null;
            data.agreeToOptOutOfAssetAccount = data.isAgreeToOptOutOfAssetAccount == true ? this.config.getConfig("dli_isAgreeToOptOutOfAssetAccount_1") : null;
            if (data.isPolicyOrInterestTransferred == "false") {
                data.assignmentType = this.config.getConfig("dli_isAbsoluteAssignmentType_" + (data.isAbsoluteAssignmentType == "true" ? 1 : 0));
            }
            data.isPolicyOrInterestTransferred = this.config.getConfig("dli_isPolicyOrInterestTransferred_" + (data.isPolicyOrInterestTransferred == "true" ? 1 : 0));
        }

        data.deliveryMethod = this.config.getConfig("dli_isLoanDeliveryStandard_" + (data.isLoanDeliveryStandard == "true" ? 1 : 0));
        data.surrenderType = this.config.getConfig("dli_surrenderType_" + (data.surrenderType == SurrenderType.Partial ? 1 : 2));
        if (data.isAddressSame == "true") {
            data.country = "";
            data.ownerAddress = this.config.getConfig("dli_isAddressSame_1");
        }
        else {
            data.ownerAddress = this.config.getConfig("dli_isAddressSame_0");
        }

        delete data.partialSurrenderType;
        delete data.partialSurrenderAmount;
        delete data.isGrossAmountForPartialSurrender;
        delete data.isLoanDeliveryStandard;
        delete data.isAddressSame;
        delete data.isAgreeToReturnPolicyByEmail;
        delete data.isAgreeForFullSurrenderCharges;
        delete data.isAgreeToOptOutOfAssetAccount;
        delete data.isAbsoluteAssignmentType;
    }

    // Below method is used to transform model key and values. Used for qualified and non qualified service requests.
    transformQualifiedNonQualifiedSerivceRequestData(data: any, requestName: string) {
        if(data.incomeTaxWithhold === this.config.getConfig("election_of_tax_with_holding_elect"))
        {
            data.withholdFederalIncomeTax = this.utility.TransformToCurrencyFormatWithoutDollarSign(data.withholdFederalIncomeTax);
            data.withholdStateIncomeTax = this.utility.TransformToCurrencyFormatWithoutDollarSign(data.withholdStateIncomeTax);
        }
        if (data.premiumType == SurrenderType.Partial) {
            let partialSurrenderTypeText = this.config.getConfig(requestName + '_partialSurrenderType_' + (data.partialSurrenderType == "true" ? 1 : 0));
            if (data.partialSurrenderType == "true") {
                data.selectedPartialSurrenderAmount = partialSurrenderTypeText + ' ' + this.utility.TransformToCurrencyFormat(data.partialSurrenderAmount);
            } else {
                data.selectedPartialSurrenderAmount = partialSurrenderTypeText;
            }
            data.selectedPartialSurrenderAmountType = this.config.getConfig(requestName + '_isGrossAmountForPartialSurrender_' + (data.isGrossAmountForPartialSurrender == "true" ? 1 : 0));
        }
        else if (data.premiumType == SurrenderType.SystematicWithdrawal) {
            let paymentStartDateText = this.config.getConfig(requestName + '_paymentStartDateMode_' + (data.paymentStartDateMode == "true" ? 1 : 0));
            let systematicWithdrawalTypeText = this.config.getConfig(requestName + '_systematicWithdrawalType_' + data.systematicWithdrawalType);
            if (data.systematicWithdrawalType == SystematicWithdrawalType.SpecificDollarAmount) {
                data.selectedSystematicWithdrawalType = systematicWithdrawalTypeText + ' ' + this.utility.TransformToCurrencyFormat(data.specificDollarAmount);
            }
            else {
                data.selectedSystematicWithdrawalType = systematicWithdrawalTypeText;
            }
            if (data.paymentStartDateMode == "true") {
                data.paymentStartDate = paymentStartDateText;
            }
            else {
                data.paymentStartDate = paymentStartDateText + '' + this.utility.TransformToDateFormat(data.paymentStartDate);
            }
            data.distributionMethodType = this.config.getConfig(requestName + '_isDistributionMethodCheck_' + (data.isDistributionMethodCheck == "true" ? 1 : 0));
            if (data.isDistributionMethodCheck == "false") {
                data.accountType = this.config.getConfig(requestName + '_isAccountTypeCheckings_' + (data.isAccountTypeCheckings == "true" ? 1 : 0));
            }
            data.selectedPaymentFrequencyMode = this.config.getConfig(requestName + '_paymentFrequencyMode_' + data.paymentFrequencyMode);
            data.selectedSystematicWithdrawalAmountType = this.config.getConfig(requestName + '_isGrossAmountForSystematicSurrender_' + (data.isGrossAmountForSystematicSurrender == "true" ? 1 : 0));
        }
        else if (data.premiumType == SurrenderType.Full) {
            data.returnPolicyType = this.config.getConfig(requestName + '_isReturnPolicyAgreed_' + (data.isReturnPolicyAgreed == "true" ? 1 : 0));
            data.agreeToSurrenderCharges = this.config.getConfig(requestName + '_isSurrenderChargesAgreed_' + (data.isSurrenderChargesAgreed == true ? 1 : 0));
        }

        if (data.withholdFederalIncomeTax == null && data.withholdStateIncomeTax == null) {
            data.currencySignFederal = "";
            data.currencySignState = "";
        }

        //remove account and routing number fields when request is not systematic withdrawal
        if (data.premiumType != SurrenderType.SystematicWithdrawal) {
            delete data.accountNumber;
            delete data.confirmAccountNumber;
            delete data.routingNumber;
            delete data.confirmRoutingNumber;
        }
        else {
            //when method type is check. passing default values.
            if (data.isDistributionMethodCheck == "true") {
                data.routingNumber = null;
                data.accountNumber = null;
                data.confirmRoutingNumber = null;
                data.confirmAccountNumber = null;
            }
        }

        delete data.premiumType;
        delete data.partialSurrenderType;
        delete data.partialSurrenderAmount;
        delete data.systematicWithdrawalType;
        delete data.specificDollarAmount;
        delete data.isDistributionMethodCheck;
        delete data.isReturnPolicyAgreed;
        delete data.isAccountTypeCheckings;
        delete data.isGrossAmountForPartialSurrender;
        delete data.isGrossAmountForSystematicSurrender;
        delete data.isSurrenderChargesAgreed;
        delete data.paymentStartDateMode;
        delete data.paymentFrequencyMode;
    }

    // Below method is used to transform model key and values. Used for change beneficiary service request.
    transformChangeBeneficiaryData(data: any) {
        if (data.isIndividual) {
            data.beneficiaryType = this.config.getConfig("cb_isIndividual_1");
            delete data.trustName;
        }
        else {
            data.beneficiaryType = this.config.getConfig("cb_isIndividual_0");
            delete data.firstName;
            delete data.lastName;
            delete data.initials;
            delete data.dob;
        }
        if (data.isInsured == "true") {
            data.relationshipTo = this.config.getConfig("cb_isInsured_1");
        }
        else {
            data.relationshipTo = this.config.getConfig("cb_isInsured_0");
        }
        delete data.isIndividual;
        delete data.isInsured;
    }
}