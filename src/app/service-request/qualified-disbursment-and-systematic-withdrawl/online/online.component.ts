import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppConfig } from "app/configuration/app.config";
import { DecimalType } from "app/enums/decimal-conversion-enum";
import { AccountType, DistributionMethodTypeMode, PartialSurrenderAmountSelectionMode, PartialSurrenderAmountType, PaymentFrequencyMode, PaymentStartDateType, ReturnPolicyTypeMode, SystematicWithdrawalType, SystematicWithdrawalAmountSelectionMode } from 'app/enums/service-request-qualified-nonQualified.enum';
import { ServiceRequestType } from "app/enums/service-type.enum";
import { SurrenderType } from 'app/enums/surrender-type.enum';
import { TaxWithHoldingOption } from "app/enums/taxwithholding-option.enum";
import { CountryModel } from 'app/models/country.model';
import { CurrencyModel } from 'app/models/currenySign.model';
import { FileUpload } from 'app/models/fileUpload.model';
import { ServiceRequestDocumentModel } from 'app/models/serviceRequestDoument.model';
import { ServiceRequestQualifiedDisbursementSystematicWithdrawalModel } from 'app/models/serviceRequestQualified.model';
import { StateModel } from 'app/models/state.model';
import { UtilityService } from 'app/services/helper/utility.service';
import { CommonService } from 'app/shared-services/common.service';
import { SpinnerService } from 'app/shared-services/spinner.service';
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'qualified-disbursement-systematic-withdrawl-online',
    styles: [],
    templateUrl: 'online.component.html'
})

export class ServiceRequestQualifiedDisbursementSystematicWithdrawlOnlineComponent implements OnInit {

    @Input('isviewonly') isViewOnly: boolean = false;
    @Input('policynumber') policyNumber: string = "";
    @Input('ownername') ownerName: string = "";
    @Input('servicetype') serviceType: ServiceRequestType = ServiceRequestType.None;

    @Output('onvaluechanged') formValue = new EventEmitter();
    @Output('onError') onError = new EventEmitter();

    public model: ServiceRequestQualifiedDisbursementSystematicWithdrawalModel = null;
    public qualifiedDisbursementSystematicWithdrawlForm: FormGroup = null;
    public userComment: string = "";
    public isPageValid: boolean = true;
    public dateFormat: string;
    public controlDisabled: boolean = true;
    public noticeOfTax: string = "";
    public noticeOfTaxDisclosure: string = "";
    public iraDistributionText: string = "";
    public surrenderChargesAgreed: string = "";
    public isFileUploadDisable: boolean = true;
    public errorMessage: string;
    public invalidFileErrorMessage: string;
    public isIncomeTaxReadOnly: boolean = true;

    public fileUploadModel: FileUpload[] = [];
    public serviceDocuments: ServiceRequestDocumentModel[] = [];
    public countryModel: CountryModel[] = [];
    public residenceStateModel: StateModel[] = [];
    public incomeTaxWithhold: string = 'incomeTaxWithhold';
    public incomeTaxWithholdOption: string = "";
    public taxWithHoldingNotElectText: string = "";
    public taxWithHoldingElectText: string = "";
    public taxWithHoldingNeitherElectText: string = "";
    public taxWithHoldingOption = TaxWithHoldingOption;
    public currencySignModel: CurrencyModel[] = [];
    public defaultCurrencySign: string = "%";
    public maxFederalLength = "11";
    public maxStateLength = "11";

    public partialSurrenderTypeText = "";
    public fullSurrenderTypeText = "";
    public systematicWithdrawalText = "";
    public partialSurrenderAmountText = "";
    public partialSurrenderMaximumAmountText = "";
    public grossAmountForPartialSurrenderText = "";
    public netAmountForPartialSurrenderText = "";
    public grossAmountForSystematicSurrenderText = "";
    public netAmountForSystematicSurrenderText = "";
    public agreeToReturnPolicyText = "";
    public policyLostText = "";
    public systematicWithdrawalInterestOnlyText = "";
    public systematicWithdrawalSpecificDollarAmountText = "";

    //Don't remove this code- as per nagesh mail & ALM#463.
    //public systematicWithdrawalGuaranteeMinimumWithdrawalBenefitText = "";
    //public systematicWithdrawalEnhancedGuaranteedMinimumWithdrawalBenefitText = "";

    public paymentFrequencyModeMonthlyText = "";
    public paymentFrequencyModeQuarterlyText = "";
    public paymentFrequencyModeSemiannualText = "";
    public paymentFrequencyModeAnnualText = "";
    public paymentStartDateImmediatelyText = "";
    public paymentStartDateOtherText = "";
    public distributionTypeCheckText = "";
    public distributionTypeEftText = "";
    public checkingAccountText = "";
    public savingAccountText = "";
    public agreeToSurrenderChargesText = "";
    public formattedPartialSurrenderAmount = "";
    public formattedSpecificDollarAmount = "";
    public formattedWithholdFederalIncomeTax = "";
    public formattedWithholdStateIncomeTax = "";

    @ViewChild("fileUploadComponent") fileUploadComponent: ElementRef;

    public DecimalType = DecimalType;

    constructor(
        private utility: UtilityService,
        private formBuilder: FormBuilder,
        public config: AppConfig,
        private spinner: SpinnerService,
        private commonService: CommonService,
        private currencyPipe: CurrencyPipe
    ) {
        this.model = this.model == null ? new ServiceRequestQualifiedDisbursementSystematicWithdrawalModel() : this.model;
        this.serviceDocuments = this.utility.getServiceRequestDocumentModel(ServiceRequestType.QualifiedDisbursementSystematicWithdrawl);
    }

    ngOnInit() {
        this.getStates('US');
        this.getCurrencySign();
        this.setFormProperties();
        this.setupFormFields();
        this.setFileUploadUnRequired();
        this.formValue.emit({ FormData: this.model });

        this.qualifiedDisbursementSystematicWithdrawlForm.valueChanges.subscribe(form => {
            if (!this.isViewOnly) {
                this.isPageValid = this.qualifiedDisbursementSystematicWithdrawlForm.valid;
                this.model = form;
                this.emitResult();
            }
        });
    }

    //set form properties text from json file
    setFormProperties() {
        this.noticeOfTax = this.utility.getConfigText("notice_of_Tax_Qualified_Disbursement");
        this.noticeOfTaxDisclosure = this.utility.getConfigText("notice_of_Tax_Qualified_Disbursement_Disclosure");
        this.iraDistributionText = this.utility.getConfigText("ira_distribution");
        this.surrenderChargesAgreed = this.utility.getConfigText("surrenderChargesAgreed_text");

        this.taxWithHoldingNotElectText = this.utility.getConfigText("election_of_tax_with_holding_not_elect");
        this.taxWithHoldingElectText = this.utility.getConfigText("election_of_tax_with_holding_elect");
        this.taxWithHoldingNeitherElectText = this.utility.getConfigText("election_of_tax_with_holding_neither_elect");

        this.partialSurrenderTypeText = this.utility.getConfigText("qasw_premiumType_" + SurrenderType.Partial);
        this.fullSurrenderTypeText = this.utility.getConfigText("qasw_premiumType_" + SurrenderType.Full);
        this.systematicWithdrawalText = this.utility.getConfigText("qasw_premiumType_" + SurrenderType.SystematicWithdrawal);

        this.partialSurrenderAmountText = this.utility.getConfigText("qasw_partialSurrenderType_" + PartialSurrenderAmountType.PartialAmount);
        this.partialSurrenderMaximumAmountText = this.utility.getConfigText("qasw_partialSurrenderType_" + PartialSurrenderAmountType.MaximumAmount);

        this.grossAmountForPartialSurrenderText = this.utility.getConfigText("qasw_isGrossAmountForPartialSurrender_" + PartialSurrenderAmountSelectionMode.GrossAmount);
        this.netAmountForPartialSurrenderText = this.utility.getConfigText("qasw_isGrossAmountForPartialSurrender_" + PartialSurrenderAmountSelectionMode.NetAmount);

        this.grossAmountForSystematicSurrenderText = this.utility.getConfigText("qasw_isGrossAmountForSystematicSurrender_" + SystematicWithdrawalAmountSelectionMode.GrossAmount);
        this.netAmountForSystematicSurrenderText = this.utility.getConfigText("qasw_isGrossAmountForSystematicSurrender_" + SystematicWithdrawalAmountSelectionMode.NetAmount);

        this.agreeToReturnPolicyText = this.utility.getConfigText("qasw_isReturnPolicyAgreed_" + ReturnPolicyTypeMode.AgreeToReturnPolicy);
        this.policyLostText = this.utility.getConfigText("qasw_isReturnPolicyAgreed_" + ReturnPolicyTypeMode.AgreeThatPolicyHasBeenLost);

        this.systematicWithdrawalInterestOnlyText = this.utility.getConfigText("qasw_systematicWithdrawalType_" + SystematicWithdrawalType.InterestOnly);
        this.systematicWithdrawalSpecificDollarAmountText = this.utility.getConfigText("qasw_systematicWithdrawalType_" + SystematicWithdrawalType.SpecificDollarAmount);

        //Don't remove this code- as per nagesh mail & ALM#463.
        //this.systematicWithdrawalGuaranteeMinimumWithdrawalBenefitText = this.utility.getConfigText("qasw_systematicWithdrawalType_" + SystematicWithdrawalType.GuaranteeMinimumWithdrawalBenefit);
        //this.systematicWithdrawalEnhancedGuaranteedMinimumWithdrawalBenefitText = this.utility.getConfigText("qasw_systematicWithdrawalType_" + SystematicWithdrawalType.EnhancedGuaranteedMinimumWithdrawalBenefit);

        this.paymentFrequencyModeMonthlyText = this.utility.getConfigText("qasw_paymentFrequencyMode_" + PaymentFrequencyMode.Monthly);
        this.paymentFrequencyModeQuarterlyText = this.utility.getConfigText("qasw_paymentFrequencyMode_" + PaymentFrequencyMode.Quarterly);
        this.paymentFrequencyModeSemiannualText = this.utility.getConfigText("qasw_paymentFrequencyMode_" + PaymentFrequencyMode.Semiannual);
        this.paymentFrequencyModeAnnualText = this.utility.getConfigText("qasw_paymentFrequencyMode_" + PaymentFrequencyMode.Annual);

        this.paymentStartDateImmediatelyText = this.utility.getConfigText("qasw_paymentStartDateMode_" + PaymentStartDateType.Immediately);
        this.paymentStartDateOtherText = this.utility.getConfigText("qasw_paymentStartDateMode_" + PaymentStartDateType.Other);

        this.distributionTypeCheckText = this.utility.getConfigText("qasw_isDistributionMethodCheck_" + DistributionMethodTypeMode.Check);
        this.distributionTypeEftText = this.utility.getConfigText("qasw_isDistributionMethodCheck_" + DistributionMethodTypeMode.ElectronicFundsTransfer);

        this.checkingAccountText = this.utility.getConfigText("qasw_isAccountTypeCheckings_" + AccountType.Checking);
        this.savingAccountText = this.utility.getConfigText("qasw_isAccountTypeCheckings_" + AccountType.Savings);
        this.agreeToSurrenderChargesText = this.utility.getConfigText("qasw_isSurrenderChargesAgreed_1");
    }

    onFileSelected(event: FileUpload) {
        this.fileUploadModel[0] = event;
        //Updating selected file in service documents
        var filterDoc = this.serviceDocuments.filter(doc => doc.documentId == event.id);
        if (filterDoc != null && filterDoc.length > 0) {
            filterDoc[0].documentFileName = event.fileName;
            filterDoc[0].documentContentLength = event.fileValue.size;
        }
        this.emitResult();
    }

    onInvalidFileSelected(message: string) {
        this.invalidFileErrorMessage = message;
        this.onError.emit(message);
    }

    setupFormFields() {
        this.qualifiedDisbursementSystematicWithdrawlForm = this.formBuilder.group({
            premiumType: [this.model.premiumType, Validators.required],
            partialSurrenderType: [this.model.partialSurrenderType],
            partialSurrenderAmount: [this.model.partialSurrenderAmount],
            isGrossAmountForPartialSurrender: [this.model.isGrossAmountForPartialSurrender],
            isSurrenderChargesAgreed: [this.model.isSurrenderChargesAgreed],
            isReturnPolicyAgreed: [this.model.isReturnPolicyAgreed],
            systematicWithdrawalType: [this.model.systematicWithdrawalType],
            isGrossAmountForSystematicSurrender: [this.model.isGrossAmountForSystematicSurrender],
            paymentFrequencyMode: [this.model.paymentFrequencyMode],
            paymentEndDate: [this.model.paymentEndDate],
            paymentStartDateMode: [this.model.paymentStartDateMode],
            paymentStartDate: [this.model.paymentStartDate],
            isDistributionMethodCheck: [this.model.isDistributionMethodCheck],
            isAccountTypeCheckings: [this.model.isAccountTypeCheckings],
            routingNumber: [this.model.routingNumber],
            accountNumber: [this.model.accountNumber],
            confirmRoutingNumber: [this.model.confirmRoutingNumber],
            confirmAccountNumber: [this.model.confirmAccountNumber],
            specificDollarAmount: [this.model.specificDollarAmount],
            incomeTaxWithhold: [this.model.incomeTaxWithhold],
            withholdFederalIncomeTax: [this.model.withholdFederalIncomeTax],
            withholdStateIncomeTax: [this.model.withholdStateIncomeTax],
            residenceState: [this.model.residenceState],
            withdrawalType: [this.model.withdrawalType],
            currencySignFederal: [this.model.currencySignFederal == "" ? this.defaultCurrencySign : this.model.currencySignFederal],
            currencySignState: [this.model.currencySignState == "" ? this.defaultCurrencySign : this.model.currencySignState]
        }, {
                validator: (formGroup: FormGroup) => {
                    formGroup.controls.partialSurrenderAmount.valueChanges.subscribe(() => {
                        if (formGroup.controls.premiumType.value == "1")
                            Validation.ValidateValueGreaterThan(formGroup.controls.partialSurrenderAmount, 500);
                    });
                    formGroup.controls.paymentStartDate.valueChanges.subscribe(() => {

                        if (formGroup.controls.premiumType.value == "3") {
                            Validation.ValidateDateGreaterThanNotEqualCurrent(formGroup.controls.paymentStartDate);
                            Validation.ValidateDateGreaterThanNotEqualCurrent(formGroup.controls.paymentEndDate);
                        }
                        Validation.ValidateDateLesserThan(formGroup.controls.paymentStartDate, formGroup.controls.paymentEndDate);
                    });
                    formGroup.controls.paymentEndDate.valueChanges.subscribe(() => {
                        if (formGroup.controls.premiumType.value == "3") {
                            Validation.ValidateDateGreaterThanNotEqualCurrent(formGroup.controls.paymentStartDate);
                            Validation.ValidateDateGreaterThanNotEqualCurrent(formGroup.controls.paymentEndDate);
                        }
                        Validation.ValidateDateLesserThan(formGroup.controls.paymentStartDate, formGroup.controls.paymentEndDate);
                        Validation.ValidateDateGreaterThan(formGroup.controls.paymentEndDate, formGroup.controls.paymentStartDate);
                    });
                    formGroup.controls.routingNumber.valueChanges.subscribe(() => {
                        if (formGroup.controls.premiumType.value == "3")
                            Validation.MatchControlValues(formGroup.controls.routingNumber, formGroup.controls.confirmRoutingNumber, false);
                    });
                    formGroup.controls.confirmRoutingNumber.valueChanges.subscribe(() => {
                        if (formGroup.controls.premiumType.value == "3")
                            Validation.MatchControlValues(formGroup.controls.routingNumber, formGroup.controls.confirmRoutingNumber, false);
                    });

                    formGroup.controls.accountNumber.valueChanges.subscribe(() => {
                        if (formGroup.controls.premiumType.value == "3")
                            Validation.MatchControlValues(formGroup.controls.accountNumber, formGroup.controls.confirmAccountNumber, false);
                    });
                    formGroup.controls.confirmAccountNumber.valueChanges.subscribe(() => {
                        if (formGroup.controls.premiumType.value == "3")
                            Validation.MatchControlValues(formGroup.controls.accountNumber, formGroup.controls.confirmAccountNumber, false);
                    });
                    formGroup.controls.specificDollarAmount.valueChanges.subscribe(() => {
                        if (formGroup.controls.premiumType.value == "3")
                            Validation.ValidateValueGreaterThan(formGroup.controls.specificDollarAmount, 100);
                    });

                    formGroup.controls.withholdFederalIncomeTax.valueChanges.subscribe(() => {
                        Validation.ValidateControlValuesGreaterThanZero(formGroup.controls.withholdFederalIncomeTax, formGroup.controls.withholdStateIncomeTax,
                            formGroup.controls.currencySignFederal, formGroup.controls.currencySignState);
                        Validation.ValidateControlValuesLessThanHundred(formGroup.controls.withholdFederalIncomeTax, formGroup.controls.withholdStateIncomeTax,
                            formGroup.controls.currencySignFederal, formGroup.controls.currencySignState);
                    });

                    formGroup.controls.withholdStateIncomeTax.valueChanges.subscribe(() => {
                        Validation.ValidateControlValuesGreaterThanZero(formGroup.controls.withholdFederalIncomeTax, formGroup.controls.withholdStateIncomeTax,
                            formGroup.controls.currencySignFederal, formGroup.controls.currencySignState);
                        Validation.ValidateControlValuesLessThanHundred(formGroup.controls.withholdFederalIncomeTax, formGroup.controls.withholdStateIncomeTax,
                            formGroup.controls.currencySignFederal, formGroup.controls.currencySignState);
                    });
                }
            });
    }

    onPremiumTypeChanged(event: any) {
        this.invalidFileErrorMessage = "";
        if (event.value == "1") {
            this.initializePartialSurrenderControls();
        }
        else if (event.value == "2") {
            this.initializeFullSurrenderControls();
        }
        else if (event.value == "3") {
            this.initializeSystematicWithdrawlControls();
        }
        this.validateControls();
        this.reinitalizeNoticeAndTaxControls();
        this.utility.disableControls([this.qualifiedDisbursementSystematicWithdrawlForm.get('specificDollarAmount')]);

        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        this.utility.disableControls([controls["currencySignFederal"], controls["currencySignState"],
        controls["withholdFederalIncomeTax"], controls["withholdStateIncomeTax"], controls["residenceState"]]);
        this.clearIncomeTaxValues();
        
        this.formattedPartialSurrenderAmount = null;
        this.formattedSpecificDollarAmount = null;

        this.errorMessage = "";
        this.invalidFileErrorMessage = "";
        this.onError.emit("");
    }
    initializePartialSurrenderControls() {
        this.qualifiedDisbursementSystematicWithdrawlForm.get('partialSurrenderType').setValue("true");
        this.qualifiedDisbursementSystematicWithdrawlForm.get('partialSurrenderAmount').setValue("");
        this.qualifiedDisbursementSystematicWithdrawlForm.get('isGrossAmountForPartialSurrender').setValue("true");
        this.qualifiedDisbursementSystematicWithdrawlForm.controls["withdrawalType"].setValue("Partial surrender");
    }
    initializeFullSurrenderControls() {
        this.qualifiedDisbursementSystematicWithdrawlForm.get('isReturnPolicyAgreed').setValue("true");
        this.qualifiedDisbursementSystematicWithdrawlForm.controls["withdrawalType"].setValue("Full surrender");
    }
    initializeSystematicWithdrawlControls() {
        this.qualifiedDisbursementSystematicWithdrawlForm.get('systematicWithdrawalType').setValue("1");
        this.qualifiedDisbursementSystematicWithdrawlForm.get('isGrossAmountForSystematicSurrender').setValue("true");
        this.qualifiedDisbursementSystematicWithdrawlForm.get('paymentFrequencyMode').setValue("1");
        this.qualifiedDisbursementSystematicWithdrawlForm.get('paymentStartDateMode').setValue("true");
        this.qualifiedDisbursementSystematicWithdrawlForm.get('isDistributionMethodCheck').setValue("true");
        this.utility.disableControls([this.qualifiedDisbursementSystematicWithdrawlForm.get('isAccountTypeCheckings')
            , this.qualifiedDisbursementSystematicWithdrawlForm.get('routingNumber')
            , this.qualifiedDisbursementSystematicWithdrawlForm.get('confirmRoutingNumber')
            , this.qualifiedDisbursementSystematicWithdrawlForm.get('accountNumber')
            , this.qualifiedDisbursementSystematicWithdrawlForm.get('confirmAccountNumber')]);
        this.qualifiedDisbursementSystematicWithdrawlForm.controls["withdrawalType"].setValue("Systematic withdrawal");
    }

    onPartialSurrenderChanged(event: any) {
        this.validatePartialSurrenderControls();
    }

    onDistributionMethodCheckChange(event: any) {
        this.onError.emit("");
        this.invalidFileErrorMessage = "";
        this.validateSystematicWithdrawlControls();
    }

    //events of common components

    onPaymentStartDateModeChanged(event: any) {
        this.validateSystematicWithdrawlControls();
    }

    onSurrenderChargesAgreedChecked(event: any) {
        if (event.checked)
            this.qualifiedDisbursementSystematicWithdrawlForm.controls["isSurrenderChargesAgreed"].setValue(true);
        else
            this.qualifiedDisbursementSystematicWithdrawlForm.controls["isSurrenderChargesAgreed"].setValue(null);
        this.validateSystematicWithdrawlControls();
    }

    public onCurrencyChanged(event) {
        event.source.id = TaxWithHoldingOption.Elect;
        this.onIncomeWithHoldChanged(event);
    }

    // Format currency values
    public onCurrencyChangedFederal(event) {
        event.source.id = TaxWithHoldingOption.Elect;
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let withholdFederalIncomeTax = controls["withholdFederalIncomeTax"];
        this.emptyControls([withholdFederalIncomeTax]);
        this.onIncomeWithHoldChanged(event);
    }

    // Format currency values
    public onCurrencyChangedState(event) {
        event.source.id = TaxWithHoldingOption.Elect;
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let withholdStateIncomeTax = controls["withholdStateIncomeTax"];
        this.emptyControls([withholdStateIncomeTax]);
        this.onIncomeWithHoldChanged(event);
    }

    private onIncomeWithHoldChanged(event) {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let incomeTaxWithhold = this.incomeTaxWithholdOption = event.source != undefined ? event.source.id : TaxWithHoldingOption.Elect;
        let withholdFederalIncomeTax = controls["withholdFederalIncomeTax"];
        let withholdStateIncomeTax = controls["withholdStateIncomeTax"];
        let residenceState = controls["residenceState"];
        let currencySignFederal = controls["currencySignFederal"];
        let currencySignState = controls["currencySignState"];
        this.errorMessage = "";
        this.invalidFileErrorMessage = "";

        if (incomeTaxWithhold == TaxWithHoldingOption.NotElect || incomeTaxWithhold == TaxWithHoldingOption.NeitherElect) {
            if (incomeTaxWithhold == TaxWithHoldingOption.NotElect) {
                this.incomeTaxWithhold = this.taxWithHoldingNotElectText;
            } else {
                this.incomeTaxWithhold = this.taxWithHoldingNeitherElectText;
            }
            this.clearIncomeTaxValues();
            this.isIncomeTaxReadOnly = true;
            this.emptyControls([withholdFederalIncomeTax, withholdStateIncomeTax, residenceState]);
            this.removeControlsValidators([withholdFederalIncomeTax, withholdStateIncomeTax, residenceState]);
            this.utility.disableControls([controls["currencySignFederal"], controls["currencySignState"], controls["withholdFederalIncomeTax"],
            controls["withholdStateIncomeTax"], controls["residenceState"]]);
        }
        else if (incomeTaxWithhold == TaxWithHoldingOption.Elect) {
            this.utility.enableControls([controls["currencySignFederal"], controls["currencySignState"], controls["withholdFederalIncomeTax"],
            controls["withholdStateIncomeTax"]]);

            this.isIncomeTaxReadOnly = false;
            this.incomeTaxWithhold = this.taxWithHoldingElectText;
            let federalControlValue = ((withholdFederalIncomeTax != undefined || withholdFederalIncomeTax != null) && (withholdFederalIncomeTax.value != null && withholdFederalIncomeTax.value != "")) ? parseFloat(withholdFederalIncomeTax.value) : null;
            let stateControlValue = ((withholdStateIncomeTax != undefined || withholdStateIncomeTax != null) && (withholdStateIncomeTax.value != null && withholdStateIncomeTax.value != "")) ? parseFloat(withholdStateIncomeTax.value) : null;

            if (federalControlValue == null && stateControlValue == null) {
                withholdFederalIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.percentReg), Validation.ValidateNumericWithAllZeroInput]);
                withholdStateIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.percentReg), Validation.ValidateNumericWithAllZeroInput]);
            }
            else if ((currencySignFederal != undefined && currencySignState != undefined) &&
                currencySignFederal.value == '%' && currencySignState.value == '%') {

                this.maxFederalLength = "6";
                withholdFederalIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.percentReg), Validation.ValidateNumericWithAllZeroInput]);
                this.maxStateLength = "6"
                withholdStateIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.percentReg), Validation.ValidateNumericWithAllZeroInput]);

                this.utility.resetResidenceState(withholdStateIncomeTax, residenceState);               
            }
            else if ((currencySignFederal != undefined && currencySignState != undefined) &&
                currencySignFederal.value != currencySignState.value) {
                if (currencySignFederal.value == '%') {
                    this.removeControlsValidators([withholdFederalIncomeTax]);
                    this.maxFederalLength = "6";
                    withholdFederalIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.percentReg), Validation.ValidateNumericWithAllZeroInput]);
                }
                else {
                    this.removeControlsValidators([withholdFederalIncomeTax]);
                    this.maxFederalLength = "11";
                    withholdFederalIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithAllZeroInput]);
                }

                if (currencySignState.value == '%') {
                    this.removeControlsValidators([withholdStateIncomeTax]);
                    this.maxStateLength = "6";
                    withholdStateIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.percentReg), Validation.ValidateNumericWithAllZeroInput]);
                }
                else {
                    this.removeControlsValidators([withholdStateIncomeTax]);
                    this.maxStateLength = "11";
                    withholdStateIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithAllZeroInput]);
                }
                this.utility.resetResidenceState(withholdStateIncomeTax, residenceState); 
            }
            else if ((currencySignFederal != undefined && currencySignState != undefined) &&
                currencySignFederal.value == '$' && currencySignState.value == '$') {

                this.maxFederalLength = "11";
                withholdFederalIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithAllZeroInput]);
                this.maxStateLength = "11"
                withholdStateIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithAllZeroInput]);

                this.utility.resetResidenceState(withholdStateIncomeTax, residenceState); 
            }
        }
        Validation.ValidateForm(this.qualifiedDisbursementSystematicWithdrawlForm);
    }

    //-------------------Systematic withdrawal controls---------//

    validateSystematicWithdrawlControls() {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let paymentStartDateMode = controls["paymentStartDateMode"];
        let paymentStartDate = controls["paymentStartDate"];
        let paymentEndDate = controls["paymentEndDate"];
        let isDistributionMethodCheck = Boolean(JSON.parse(controls["isDistributionMethodCheck"].value));
        let isAccountTypeCheckings = controls["isAccountTypeCheckings"];
        let routingNumber = controls["routingNumber"];
        let confirmRoutingNumber = controls["confirmRoutingNumber"];
        let accountNumber = controls["accountNumber"];
        let confirmAccountNumber = controls["confirmAccountNumber"];
        let premiumType = controls["premiumType"].value;
        let specificDollarAmount = controls["specificDollarAmount"];
        if (premiumType == "3") {
            if (!Boolean(JSON.parse(paymentStartDateMode.value))) {
                this.utility.enableControls([paymentStartDate, paymentEndDate]);
                paymentStartDate.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput]);
                // ALM-199 Multiple UAT issues from the Nancy spreadsheet - Allow optional, payment end date for all systematic withdrawals.
                // paymentEndDate.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput]);
            }
            else {
                this.emptyControls([paymentStartDate]);
                this.removeControlsValidators([paymentStartDate]);
            }
            // ALM-199 Multiple UAT issues from the Nancy spreadsheet - Allow optional, payment end date for all systematic withdrawals.
            // else {
            //     this.emptyControls([paymentStartDate, paymentEndDate]);
            //     this.removeControlsValidators([paymentStartDate, paymentEndDate]);
            //     this.disableControls([paymentStartDate, paymentEndDate]);
            // }

            if (!isDistributionMethodCheck) {
                this.isFileUploadDisable = false;
                this.setFileUploadRequired();
                this.utility.enableControls([isAccountTypeCheckings, routingNumber, accountNumber, confirmRoutingNumber, confirmAccountNumber]);
                routingNumber.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.minLength(9)]);
                accountNumber.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.minLength(6)]);
                isAccountTypeCheckings.setValidators([Validators.required]);
                confirmRoutingNumber.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.minLength(9)]);
                confirmAccountNumber.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.minLength(6)]);
            }
            else {
                this.isFileUploadDisable = true;
                this.setFileUploadUnRequired();
                this.emptyControls([isAccountTypeCheckings, routingNumber, accountNumber, confirmRoutingNumber, confirmAccountNumber]);
                this.removeControlsValidators([isAccountTypeCheckings, routingNumber, accountNumber, confirmRoutingNumber, confirmAccountNumber]);
                this.utility.disableControls([isAccountTypeCheckings, routingNumber, accountNumber, confirmRoutingNumber, confirmAccountNumber]);
            }
        }
        else {
            this.isFileUploadDisable = true;
            this.setFileUploadUnRequired();
            this.emptyControls([paymentStartDate, paymentEndDate]);
            this.removeControlsValidators([paymentStartDate, paymentEndDate]);
            this.utility.disableControls([paymentStartDate, paymentEndDate]);
            this.emptyControls([isAccountTypeCheckings, routingNumber, accountNumber, confirmRoutingNumber, confirmAccountNumber]);
            this.removeControlsValidators([isAccountTypeCheckings, routingNumber, accountNumber, confirmRoutingNumber, confirmAccountNumber]);
            this.utility.disableControls([isAccountTypeCheckings, routingNumber, accountNumber, confirmRoutingNumber, confirmAccountNumber]);
        }
        Validation.ValidateForm(this.qualifiedDisbursementSystematicWithdrawlForm);
    }

    removeValidationsOfSystematicWithdrawlControls() {
        this.isFileUploadDisable = true;
        this.setFileUploadUnRequired();
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let paymentStartDate = controls["paymentStartDate"];
        let paymentEndDate = controls["paymentEndDate"];
        let isAccountTypeCheckings = controls["isAccountTypeCheckings"];
        let routingNumber = controls["routingNumber"];
        let confirmRoutingNumber = controls["confirmRoutingNumber"];
        let accountNumber = controls["accountNumber"];
        let confirmAccountNumber = controls["confirmAccountNumber"];
        let specificDollarAmount = controls["specificDollarAmount"];
        this.emptyControls([paymentStartDate, paymentEndDate, isAccountTypeCheckings, routingNumber, accountNumber, confirmRoutingNumber, confirmAccountNumber, specificDollarAmount]);
        this.removeControlsValidators([paymentStartDate, paymentEndDate, isAccountTypeCheckings, routingNumber, accountNumber, confirmRoutingNumber, confirmAccountNumber, specificDollarAmount]);
        this.utility.disableControls([paymentStartDate, paymentEndDate, isAccountTypeCheckings, routingNumber, accountNumber, confirmRoutingNumber, confirmAccountNumber, specificDollarAmount]);

        Validation.ValidateForm(this.qualifiedDisbursementSystematicWithdrawlForm);
    }

    setFileUploadRequired() {
        if (this.fileUploadModel.length == 0) {
            this.fileUploadModel = [];
            this.serviceDocuments.forEach(doc => {
                this.fileUploadModel.push(new FileUpload(doc.documentId, doc.name, doc.documentContentType, true, "", null, true));
            });
        }
    }

    setFileUploadUnRequired() {
        this.fileUploadModel = [];
    }

    //-------------------Partial surrender controls---------//
    validatePartialSurrenderControls() {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let partialSurrenderType = controls["partialSurrenderType"];
        let partialSurrenderAmount = controls["partialSurrenderAmount"];

        if (Boolean(JSON.parse(partialSurrenderType.value))) {
            this.utility.enableControls([partialSurrenderAmount]);
            partialSurrenderAmount.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithNoAllZeroInput]);
        }
        else {
            this.emptyControls([partialSurrenderAmount]);
            this.removeControlsValidators([partialSurrenderAmount]);
            this.utility.disableControls([partialSurrenderAmount]);
        }
        Validation.ValidateForm(this.qualifiedDisbursementSystematicWithdrawlForm);
    }

    removeValidationsOfPartialSurrenderControls() {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let partialSurrenderAmount = controls["partialSurrenderAmount"];
        this.emptyControls([partialSurrenderAmount]);
        this.removeControlsValidators([partialSurrenderAmount]);
        this.utility.disableControls([partialSurrenderAmount]);
        Validation.ValidateForm(this.qualifiedDisbursementSystematicWithdrawlForm);
    }

    //-------------------Full surrender controls---------//
    private validateFullSurrenderControls() {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let isSurrenderChargesAgreed = controls["isSurrenderChargesAgreed"];
        this.utility.enableControls([isSurrenderChargesAgreed]);
        isSurrenderChargesAgreed.setValidators([Validators.required]);
        Validation.ValidateForm(this.qualifiedDisbursementSystematicWithdrawlForm);
    }

    private removeValidationOfFullSurrenderControls() {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let isSurrenderChargesAgreed = controls["isSurrenderChargesAgreed"];
        this.emptyControls([isSurrenderChargesAgreed]);
        this.removeControlsValidators([isSurrenderChargesAgreed]);
        Validation.ValidateForm(this.qualifiedDisbursementSystematicWithdrawlForm);
    }

    validateControls() {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let premiumType = controls["premiumType"].value;

        if (premiumType == "1") {
            this.validatePartialSurrenderControls();
            this.removeValidationsOfSystematicWithdrawlControls();
            this.removeValidationOfFullSurrenderControls();
        }
        else if (premiumType == "2") {
            this.removeValidationsOfPartialSurrenderControls();
            this.removeValidationsOfSystematicWithdrawlControls();
            this.validateFullSurrenderControls();
        }
        else if (premiumType == "3") {
            this.removeValidationsOfPartialSurrenderControls();
            this.removeValidationOfFullSurrenderControls();
            this.validateSystematicWithdrawlControls();
        }
        Validation.ValidateForm(this.qualifiedDisbursementSystematicWithdrawlForm);
    }

    emitResult(comment: any = "") {
        let result = {
            RequestType: ServiceRequestType.QualifiedDisbursementSystematicWithdrawl,
            QualifiedDisbursementSystematicWithdrawlData: this.model,
            UploadedFile: this.fileUploadModel,
            ServiceDocuments: this.serviceDocuments,
            IsDataValid: this.pageIsValid && this.isSelectedFileValid,
            UserComment: comment == "" ? this.userComment : comment
        };
        this.formValue.emit(result);
    }

    emptyControls(controlList: any) {
        controlList.forEach(control => {
            control.setValue(null);
        });
    }

    removeControlsValidators(controlList: any) {
        controlList.forEach(control => {
            control.setValidators(null);
        });
    }

    markControlsDirty(controlList: any) {
        controlList.forEach(control => {
            control.markAsTouched();
        });
    }

    private setValueAsEmpty(controlName: string) {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let control = controls[controlName];
        if (control != null) {
            control.setValue(null);
        }
    }

    get pageIsValid(): boolean {
        //To fix ALM-434, we also need to validate page by checking if there is no invalid/error file message.
        return this.isPageValid && (!this.invalidFileErrorMessage || this.invalidFileErrorMessage.length <= 0);
    }

    private get isSelectedFileValid(): boolean {
        let isDistributionMethodCheck = Boolean(JSON.parse(this.qualifiedDisbursementSystematicWithdrawlForm.get('isDistributionMethodCheck').value));

        if (this.model.premiumType == '3' && !isDistributionMethodCheck)
            return this.fileUploadModel.filter(x => (x.isRequired == true && x.fileValue == null) || (x.fileName != '' && x.fileName.toLowerCase().indexOf('.pdf') <= -1)).length <= 0;
        else
            return true;
    }

    private getStates(countryCode: string) {
        this.spinner.start();
        this.commonService.getStates(countryCode).subscribe(results => {
            this.spinner.stop();
            this.residenceStateModel = results;
        }, error => {
            this.spinner.stop();
        });
    }

    private getCurrencySign() {
        this.spinner.start();
        this.currencySignModel = [
            { id: "1", value: "%" },
            { id: "2", value: "$" }
        ];
        this.spinner.stop();
    }

    private reinitalizeNoticeAndTaxControls() {
        this.isIncomeTaxReadOnly = true;
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;

        let incomeTaxWithhold = controls["incomeTaxWithhold"];
        incomeTaxWithhold.setValue(this.taxWithHoldingNeitherElectText);
        this.incomeTaxWithholdOption = TaxWithHoldingOption.NeitherElect.toString();

        let withholdFederalIncomeTax = controls["withholdFederalIncomeTax"];
        let withholdStateIncomeTax = controls["withholdStateIncomeTax"];
        let residenceState = controls["residenceState"];

        this.emptyControls([withholdFederalIncomeTax, withholdStateIncomeTax, residenceState]);
        this.removeControlsValidators([withholdFederalIncomeTax, withholdStateIncomeTax, residenceState]);
        Validation.ValidateForm(this.qualifiedDisbursementSystematicWithdrawlForm);
    }

    onSystematicWithdrawalTypeChange(event: any) {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let specificDollarAmount = controls["specificDollarAmount"];
        let systematicWithdrawalType = controls["systematicWithdrawalType"].value;

        //for SPECIFIC DOLLAR AMOUNT selection
        if (event.value == 2) {
            this.utility.enableControls([specificDollarAmount]);
            specificDollarAmount.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithNoAllZeroInput]);
        }
        else if (event.value != undefined) {
            this.emptyControls([specificDollarAmount]);
            this.removeControlsValidators([specificDollarAmount]);
            this.utility.disableControls([specificDollarAmount]);
        }
        Validation.ValidateForm(this.qualifiedDisbursementSystematicWithdrawlForm);
    }

    // Format currency values
    private transformPartialSurrenderAmount(element: any) {
        this.formattedPartialSurrenderAmount = this.currencyPipe.transform(this.model.partialSurrenderAmount, null, '', '1.2-2');
        element.target.value = this.formattedPartialSurrenderAmount;
        element.target.maxLength = 17;
    }

    // Format currency values
    private normalizePartialSurrenderAmount(element: any) {
        this.formattedPartialSurrenderAmount = this.model.partialSurrenderAmount ? this.model.partialSurrenderAmount.toString() : '';
        element.target.value = this.formattedPartialSurrenderAmount;
        element.target.maxLength = 11;
    }

    // Format currency values
    private transformSpecificDollarAmount(element: any) {
        this.formattedSpecificDollarAmount = this.currencyPipe.transform(this.model.specificDollarAmount, null, '', '1.2-2');
        element.target.value = this.formattedSpecificDollarAmount;
        element.target.maxLength = 17;
    }

    // Format currency values
    private normalizeSpecificDollarAmount(element: any) {
        this.formattedSpecificDollarAmount = this.model.specificDollarAmount ? this.model.specificDollarAmount.toString() : '';
        element.target.value = this.formattedSpecificDollarAmount;
        element.target.maxLength = 11;
    }

    private transformWithholdFederalIncomeTaxAndChkValidationOnBlur(element: any) {
        this.transformWithholdFederalIncomeTax(element);
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        this.utility.ChkValidateNumberWithDecimalAndLeadingZeroOnBlur(element, parseFloat(this.model.withholdFederalIncomeTax), controls["withholdFederalIncomeTax"], this.qualifiedDisbursementSystematicWithdrawlForm);
        if (controls["currencySignFederal"].value == '%') {
            this.formattedWithholdFederalIncomeTax = this.model.withholdFederalIncomeTax;
        }
        else {
            if (this.model.withholdFederalIncomeTax == "" || this.model.withholdFederalIncomeTax == "0") {
                this.formattedWithholdFederalIncomeTax = "0.00";
            }
        }
    }

    private normalizeWithholdFederalIncomeTaxAndChkValidationOnFocus(element: any) {
        this.normalizeWithholdFederalIncomeTax(element);
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        if (controls["currencySignFederal"].value == '%') {
            this.utility.ChkValidationsOnFocus(controls["withholdFederalIncomeTax"], this.qualifiedDisbursementSystematicWithdrawlForm,
                [Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithAllZeroInput,
                Validators.pattern(Validation.percentReg)]);
        }
        else {
            this.utility.ChkValidationsOnFocus(controls["withholdFederalIncomeTax"], this.qualifiedDisbursementSystematicWithdrawlForm,
                [Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithAllZeroInput]);
        }

    }

    // Format currency values
    private transformWithholdFederalIncomeTax(element: any) {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let currencySignFederal = controls["currencySignFederal"];
        this.formattedWithholdFederalIncomeTax = this.model.withholdFederalIncomeTax;

        if (currencySignFederal != undefined && currencySignFederal.value != '$') return;

        this.formattedWithholdFederalIncomeTax = this.currencyPipe.transform(this.model.withholdFederalIncomeTax, null, '', '1.2-2');
        element.target.value = this.formattedWithholdFederalIncomeTax;
        element.target.maxLength = 17;
    }

    // Format currency values
    private normalizeWithholdFederalIncomeTax(element: any) {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let currencySignFederal = controls["currencySignFederal"];

        if (currencySignFederal != undefined && currencySignFederal.value != '$') return;

        this.formattedWithholdFederalIncomeTax = this.model.withholdFederalIncomeTax ? this.model.withholdFederalIncomeTax.toString() : '';
        element.target.value = this.formattedWithholdFederalIncomeTax;
        element.target.maxLength = 11;
    }

    private transformWithholdStateIncomeTaxAndChkValidationOnBlur(element: any) {
        this.transformWithholdStateIncomeTax(element);
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        this.utility.ChkValidateNumberWithDecimalAndLeadingZeroOnBlur(element, parseFloat(this.model.withholdStateIncomeTax), controls["withholdStateIncomeTax"], this.qualifiedDisbursementSystematicWithdrawlForm);
        if (controls["currencySignState"].value == '%') {
            this.formattedWithholdStateIncomeTax = this.model.withholdStateIncomeTax;
        }
        else {
            if (this.model.withholdStateIncomeTax == "" || this.model.withholdStateIncomeTax == "0") {
                this.formattedWithholdStateIncomeTax = "0.00";
            }
        }
    }

    private normalizeWithholdStateIncomeTaxAndChkValidationOnFocus(element: any) {
        this.normalizeWithholdStateIncomeTax(element);
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        if (controls["currencySignState"].value == '%') {
            this.utility.ChkValidationsOnFocus(controls["withholdStateIncomeTax"], this.qualifiedDisbursementSystematicWithdrawlForm, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithAllZeroInput, Validators.pattern(Validation.percentReg)]);
        }
        else {
            this.utility.ChkValidationsOnFocus(controls["withholdStateIncomeTax"], this.qualifiedDisbursementSystematicWithdrawlForm, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithAllZeroInput]);
        }
    }

    // Format currency values
    private transformWithholdStateIncomeTax(element: any) {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let currencySignState = controls["currencySignState"];
        this.formattedWithholdStateIncomeTax = this.model.withholdStateIncomeTax;

        if (currencySignState != undefined && currencySignState.value != '$') return;

        this.formattedWithholdStateIncomeTax = this.currencyPipe.transform(this.model.withholdStateIncomeTax, null, '', '1.2-2');
        element.target.value = this.formattedWithholdStateIncomeTax;
        element.target.maxLength = 17;
    }

    // Format currency values
    private normalizeWithholdStateIncomeTax(element: any) {
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let currencySignState = controls["currencySignState"];

        if (currencySignState != undefined && currencySignState.value != '$') return;

        this.formattedWithholdStateIncomeTax = this.model.withholdStateIncomeTax ? this.model.withholdStateIncomeTax.toString() : '';
        element.target.value = this.formattedWithholdStateIncomeTax;
        element.target.maxLength = 11;
    }

    private clearIncomeTaxValues(){
        this.model.withholdFederalIncomeTax = null;
        this.model.withholdStateIncomeTax = null;
        this.formattedWithholdFederalIncomeTax = null;
        this.formattedWithholdStateIncomeTax = null;
    }

    //resetting residence state value on witholdStateIncomeTax keyup event
    private resetResidenceState() {       
        let controls = this.qualifiedDisbursementSystematicWithdrawlForm.controls;
        let withholdStateIncomeTax = controls["withholdStateIncomeTax"];       
        let residenceState = controls["residenceState"];
        this.utility.resetResidenceState(withholdStateIncomeTax, residenceState); 
    }   
}
