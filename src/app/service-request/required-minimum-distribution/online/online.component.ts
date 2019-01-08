import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppConfig } from "app/configuration/app.config";
import { AccountType } from "app/enums/account-type.enum";
import { DecimalType } from "app/enums/decimal-conversion-enum";
import { DistributedElectionType } from 'app/enums/distributed-election-type.enum';
import { NoElectionType } from 'app/enums/election-type.enum';
import { PaymentOption } from 'app/enums/payment-option.enum';
import { PaymentType } from "app/enums/payment-type.enum";
import { ServiceRequestType } from 'app/enums/service-type.enum';
import { TaxWithHoldingOption } from "app/enums/taxwithholding-option.enum";
import { CountryModel } from 'app/models/country.model';
import { CurrencyModel } from 'app/models/currenySign.model';
import { FileUpload } from 'app/models/fileUpload.model';
import { ServiceRequestDocumentModel } from 'app/models/serviceRequestDoument.model';
import { ServiceRequestRequiredMinimumDistributionModel } from 'app/models/serviceRequestRequiredMinimumDistribution.model';
import { StateModel } from 'app/models/state.model';
import { UtilityService } from 'app/services/helper/utility.service';
import { CommonService } from 'app/shared-services/common.service';
import { SpinnerService } from 'app/shared-services/spinner.service';
import { Validation } from 'app/shared-services/validation.service';

@Component({
    selector: 'required-minimum-distribution',
    styles: [],
    templateUrl: 'online.component.html'
})

export class RequiredMinimumDistributionComponent {
    @Output('onValueChanged') formValueChanged = new EventEmitter();
    @Input('isViewOnly') isViewOnly: boolean = false;
    @Output('onError') onError = new EventEmitter();

    //#region Page Level Variables
    public isIncomeTaxReadOnly: boolean = true;
    public DecimalType = DecimalType;
    public errorMessage: string;
    public invalidFileErrorMessage: string;
    //#region Page Level Variables

    //#region FormGroup Control Name Variable    
    public paymentOption: string = 'paymentOption';
    public ownCalculationDollarAmt: string = 'ownCalculationDollarAmt';
    public jointLifeExpectancyDob: string = 'jointLifeExpectancyDob';
    public fairMarketValue: string = 'fairMarketValue';
    public paymentType: string = 'paymentType';
    public accountType: string = 'accountType';
    public accountBankName: string = 'accountBankName';
    public accountTelephoneNumber: string = 'accountTelephoneNumber';
    public accountNumber: string = 'accountNumber';
    public accountBankRoutingNumber: string = 'accountBankRoutingNumber';
    public distributionElection: string = 'distributedElectionType';
    public noElection: string = 'noElectionType';
    public incomeTaxWithhold: string = 'incomeTaxWithhold';
    public withholdFederalIncomeTax: 'withholdFederalIncomeTax';
    public withholdStateIncomeTax: 'withholdStateIncomeTax';
    public residenceState: 'residenceState';
    public taxWithHoldingNotElectText: string = "";
    public taxWithHoldingElectText: string = "";
    public taxWithHoldingNeitherElectText: string = "";
    public incomeTaxWithholdOption: string = "";
    public currencySignModel: CurrencyModel[] = [];
    public defaultCurrencySign: string = "%";

    public sponsorByOtherQualifiedFundText: string = "";
    public sponsorByCurrentEmployerText: string = "";

    public newDistributionElectionText: string = "";
    public updateDistributionElectionText: string = "";
    public terminateDistributionElectionText: string = "";

    public currentYearPaymentOptionText: string = "";
    public monthlyPaymentOptionText: string = "";
    public semiannualPaymentOptionText: string = "";
    public annualPaymentOptionText: string = "";
    public ownCalculationPaymentOptionText: string = "";
    public jointLifeExpectancyPaymentOptionText: string = "";

    public electronicPaymentTypeOptionText: string = "";
    public chequePaymentTypeOptionText: string = "";

    public checkingAccountTypeOptionText: string = "";
    public savingAccountTypeOptionText: string = "";

    public formattedOwnCalculationDollarAmt: string = "";
    public formattedFairMarketValue: string = "";
    public formattedWithholdFederalIncomeTax: string = "";
    public formattedWithholdStateIncomeTax: string = "";

    //#endregion

    //#region Module Level Variables
    public model: ServiceRequestRequiredMinimumDistributionModel = null;
    public rmdFormGroup: FormGroup = null;

    public NoElectionType = NoElectionType;
    public DistributedElectionType = DistributedElectionType;
    public PaymentOption = PaymentOption;
    public PaymentType = PaymentType;
    public AccountType = AccountType;
    public dateFormat: string;
    public taxWithHoldingOption = TaxWithHoldingOption;

    public serviceDocuments: ServiceRequestDocumentModel[] = [];
    public fileUploadModel: FileUpload[] = [];
    public countryModel: CountryModel[] = [];
    public residenceStateModel: StateModel[] = [];
    public maxFederalLength = "11";
    public maxStateLength = "11"; 
    //#endregion

    //#region Constructor
    constructor(private formBuilder: FormBuilder,
        public config: AppConfig,
        private utility: UtilityService,
        private spinner: SpinnerService,
        private commonService: CommonService,
        private currencyPipe: CurrencyPipe) {
        this.dateFormat = this.config.getConfig("date_format");

        this.model = this.model == null ? new ServiceRequestRequiredMinimumDistributionModel() : this.model;
        this.serviceDocuments = this.utility.getServiceRequestDocumentModel(ServiceRequestType.RequestRequiredMinimumDistribution);
    }
    //#endregion

    //#region Page Event
    ngOnInit() {
        this.getStates('US');
        this.getCurrencySign();
        this.setRadioButtonsText();
        this.setupFormFields();

        //Raising invalid form state event.
        this.formValueChanged.emit({ FormData: this.model });

        this.rmdFormGroup.valueChanges.subscribe(form => {
            if (!this.isViewOnly) {
                this.model = form;
                this.emitResult();
            }
        });  
    }
    //#endregion

    private setRadioButtonsText() {
        this.taxWithHoldingNotElectText = this.utility.getConfigText("election_of_tax_with_holding_not_elect");
        this.taxWithHoldingElectText = this.utility.getConfigText("election_of_tax_with_holding_elect");
        this.taxWithHoldingNeitherElectText = this.utility.getConfigText("election_of_tax_with_holding_neither_elect");

        this.sponsorByOtherQualifiedFundText = this.utility.getConfigText("rmd_noElectionType_" + NoElectionType.SponsorByOtherQualifiedFund);
        this.sponsorByCurrentEmployerText = this.utility.getConfigText("rmd_noElectionType_" + NoElectionType.SponsorByCurrentEmployer);

        this.newDistributionElectionText = this.utility.getConfigText("rmd_distributedElectionType_" + DistributedElectionType.New);
        this.updateDistributionElectionText = this.utility.getConfigText("rmd_distributedElectionType_" + DistributedElectionType.Existing);
        this.terminateDistributionElectionText = this.utility.getConfigText("rmd_distributedElectionType_" + DistributedElectionType.Terminate);

        this.currentYearPaymentOptionText = this.utility.getConfigText("rmd_paymentOption_" + PaymentOption.CurrentYearOnly);
        this.monthlyPaymentOptionText = this.utility.getConfigText("rmd_paymentOption_" + PaymentOption.Monthly);
        this.semiannualPaymentOptionText = this.utility.getConfigText("rmd_paymentOption_" + PaymentOption.SemiAnnual);
        this.annualPaymentOptionText = this.utility.getConfigText("rmd_paymentOption_" + PaymentOption.Annual);
        this.ownCalculationPaymentOptionText = this.utility.getConfigText("rmd_paymentOption_" + PaymentOption.OwnCalculation);
        this.jointLifeExpectancyPaymentOptionText = this.utility.getConfigText("rmd_paymentOption_" + PaymentOption.JointLifeExpectancy);

        this.electronicPaymentTypeOptionText = this.utility.getConfigText("rmd_paymentType_" + PaymentType.ElectronicPayment);
        this.chequePaymentTypeOptionText = this.utility.getConfigText("rmd_paymentType_" + PaymentType.ChequePayment);

        this.checkingAccountTypeOptionText = this.utility.getConfigText("rmd_accountType_" + AccountType.CheckingAccount);
        this.savingAccountTypeOptionText = this.utility.getConfigText("rmd_accountType_" + AccountType.SavingAccount);
    }

    //#region Control's Event
    private setupFormFields() {
        // this.model.noElectionType==NoElectionType.SponsorByOtherQualifiedFund
        this.rmdFormGroup = this.formBuilder.group({
            noElectionType: [this.model.noElectionType],
            distributedElectionType: [this.model.distributedElectionType],
            paymentOption: [this.model.paymentOption],
            ownCalculationDollarAmt: [this.model.ownCalculationDollarAmt],
            jointLifeExpectancyDob: [this.model.jointLifeExpectancyDob],
            fairMarketValue: [this.model.fairMarketValue],
            paymentType: [this.model.paymentType],
            accountType: [this.model.accountType, Validators.required],         // ALM-368 (ALM-215)
            // accountType: [this.model.accountType],
            accountBankName: [this.model.accountBankName],
            accountTelephoneNumber: [this.model.accountTelephoneNumber],
            accountNumber: [this.model.accountNumber],
            accountBankRoutingNumber: [this.model.accountBankRoutingNumber],
            incomeTaxWithhold: [this.model.incomeTaxWithhold],
            withholdFederalIncomeTax: [this.model.withholdFederalIncomeTax],
            withholdStateIncomeTax: [this.model.withholdStateIncomeTax],
            residenceState: [this.model.residenceState],
            currenySignFederal: [this.model.currenySignFederal == "" ? this.defaultCurrencySign : this.model.currenySignFederal],
            currenySignState: [this.model.currenySignState == "" ? this.defaultCurrencySign : this.model.currenySignState]
        },
            {
                validator: (formGroup: FormGroup) => {
                    formGroup.controls.jointLifeExpectancyDob.valueChanges.subscribe(() => {
                        Validation.ValidateDob(formGroup.controls.jointLifeExpectancyDob);
                    });

                    formGroup.controls.withholdFederalIncomeTax.valueChanges.subscribe(() => {
                        Validation.ValidateControlValuesGreaterThanZero(formGroup.controls.withholdFederalIncomeTax, formGroup.controls.withholdStateIncomeTax,
                            formGroup.controls.currenySignFederal, formGroup.controls.currenySignState);
                        Validation.ValidateControlValuesLessThanHundred(formGroup.controls.withholdFederalIncomeTax, formGroup.controls.withholdStateIncomeTax,
                            formGroup.controls.currenySignFederal, formGroup.controls.currenySignState);
                    });

                    formGroup.controls.withholdStateIncomeTax.valueChanges.subscribe(() => {
                        Validation.ValidateControlValuesGreaterThanZero(formGroup.controls.withholdFederalIncomeTax, formGroup.controls.withholdStateIncomeTax,
                            formGroup.controls.currenySignFederal, formGroup.controls.currenySignState);
                        Validation.ValidateControlValuesLessThanHundred(formGroup.controls.withholdFederalIncomeTax, formGroup.controls.withholdStateIncomeTax,
                            formGroup.controls.currenySignFederal, formGroup.controls.currenySignState);
                    });
                }
            });           
    }

    private onNoElectionRadioStateChanged(event) {
        this.utility.resetFormGroup(this.rmdFormGroup);
        this.rmdFormGroup.controls[this.distributionElection].setValue(null);
        this.clearControlValues();
        this.emitResult();
    }

    private onDistributedElectionRadioStateChanged(event) {
        this.utility.resetFormGroup(this.rmdFormGroup);
        this.rmdFormGroup.controls[this.noElection].setValue(NoElectionType.None);
        this.reinitalizeNoticeAndTaxControls();
        if (event.value !== DistributedElectionType.Terminate) {
            this.setDefaultValue();
        }
        this.clearControlValues();
        this.clearIncomeTaxValues();
    }

    private clearControlValues() {
        this.invalidFileErrorMessage = "";
        this.onError.emit("");
        this.errorMessage = "";
        //need to reset file upload model on distributed election type change
        if (this.fileUploadModel[0].fileValue != null) {
            this.fileUploadModel = [];
            this.setFileUploadRequired();
        }
    }

    // ALM-368 (ALM-215)
    private onAccountTypeRadioStateChanged(event) {
        Validation.ValidateForm(this.rmdFormGroup);
    }

    private onPaymentOptionRadioStateChanged(event) {
        this.makePaymentOptionMandatory(event.value);
        Validation.ValidateForm(this.rmdFormGroup);
    }

    private onPaymentRadioStateChanged(event) {
        this.makeBankInfoMandatory(event.value);
        Validation.ValidateForm(this.rmdFormGroup);
    }

    private onCurrencyChanged(event) {
        event.source.id = TaxWithHoldingOption.Elect;
        this.onIncomeWithHoldChanged(event);
    }

    // Format currency values
    public onCurrencyChangedFederal(event) {
        event.source.id = TaxWithHoldingOption.Elect;
        let controls = this.rmdFormGroup.controls;
        let withholdFederalIncomeTax = controls["withholdFederalIncomeTax"];
        this.emptyControls([withholdFederalIncomeTax]);
        this.onIncomeWithHoldChanged(event);
    }

    // Format currency values
    public onCurrencyChangedState(event) {
        event.source.id = TaxWithHoldingOption.Elect;
        let controls = this.rmdFormGroup.controls;
        let withholdStateIncomeTax = controls["withholdStateIncomeTax"];
        this.emptyControls([withholdStateIncomeTax]);
        this.onIncomeWithHoldChanged(event);
    }

    private onIncomeWithHoldChanged(event) {
        let controls = this.rmdFormGroup.controls;
        let incomeTaxWithhold = this.incomeTaxWithholdOption = event.source != undefined ? event.source.id : TaxWithHoldingOption.Elect;
        let withholdFederalIncomeTax = controls["withholdFederalIncomeTax"];
        let withholdStateIncomeTax = controls["withholdStateIncomeTax"];
        let residenceState = controls["residenceState"];
        let currenySignFederal = controls["currenySignFederal"];
        let currenySignState = controls["currenySignState"];
        this.errorMessage = "";
        this.invalidFileErrorMessage = "";


        if (incomeTaxWithhold == TaxWithHoldingOption.NotElect || incomeTaxWithhold == TaxWithHoldingOption.NeitherElect) {

            if (incomeTaxWithhold == TaxWithHoldingOption.NotElect) {
                this.incomeTaxWithhold = this.taxWithHoldingNotElectText;
            }
            else {
                this.incomeTaxWithhold = this.taxWithHoldingNeitherElectText;
            }
            this.clearIncomeTaxValues();
            this.isIncomeTaxReadOnly = true;
            this.makeValidatorEmpty("withholdFederalIncomeTax");
            this.setValueAsEmpty("withholdFederalIncomeTax");

            this.makeValidatorEmpty("withholdStateIncomeTax");
            this.setValueAsEmpty("withholdStateIncomeTax");

            this.makeValidatorEmpty("residenceState");
            this.setValueAsEmpty("residenceState");

            this.utility.disableControls([controls["currenySignFederal"], controls["currenySignState"], controls["withholdFederalIncomeTax"],
            controls["withholdStateIncomeTax"], controls["residenceState"]]);
        }
        else if (incomeTaxWithhold == TaxWithHoldingOption.Elect) {  

            this.utility.enableControls([controls["currenySignFederal"], controls["currenySignState"], controls["withholdFederalIncomeTax"],
            controls["withholdStateIncomeTax"]]);

            this.isIncomeTaxReadOnly = false;
            this.incomeTaxWithhold = this.taxWithHoldingElectText;
            let federalControlValue = ((withholdFederalIncomeTax != undefined || withholdFederalIncomeTax != null) && (withholdFederalIncomeTax.value != null && withholdFederalIncomeTax.value != "")) ? parseFloat(withholdFederalIncomeTax.value) : null;
            let stateControlValue = ((withholdStateIncomeTax != undefined || withholdStateIncomeTax != null) && (withholdStateIncomeTax.value != null && withholdStateIncomeTax.value != "")) ? parseFloat(withholdStateIncomeTax.value) : null;

            if (federalControlValue == null && stateControlValue == null) {
                withholdFederalIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.percentReg), Validation.ValidateNumericWithAllZeroInput]);
                withholdStateIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.percentReg), Validation.ValidateNumericWithAllZeroInput]);
            }
            else if ((currenySignFederal != undefined && currenySignState != undefined) &&
                currenySignFederal.value == '%' && currenySignState.value == '%') {

                this.maxFederalLength = "6";
                withholdFederalIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.percentReg), Validation.ValidateNumericWithAllZeroInput]);
                this.maxStateLength = "6"
                withholdStateIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.percentReg), Validation.ValidateNumericWithAllZeroInput]);
             
                this.utility.resetResidenceState(withholdStateIncomeTax, residenceState); 
            }
            else if ((currenySignFederal != undefined && currenySignState != undefined) &&
                currenySignFederal.value != currenySignState.value) {
                if (currenySignFederal.value == '%') {
                    this.removeControlsValidators([withholdFederalIncomeTax]);
                    this.maxFederalLength = "6";
                    withholdFederalIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.percentReg), Validation.ValidateNumericWithAllZeroInput]);
                }
                else {
                    this.removeControlsValidators([withholdFederalIncomeTax]);
                    this.maxFederalLength = "11";
                    withholdFederalIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithAllZeroInput]);
                }

                if (currenySignState.value == '%') {
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
            else if ((currenySignFederal != undefined && currenySignState != undefined) &&
                currenySignFederal.value == '$' && currenySignState.value == '$') {

                this.maxFederalLength = "11";
                withholdFederalIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithAllZeroInput]);
                this.maxStateLength = "11"
                withholdStateIncomeTax.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithAllZeroInput]);
                
                this.utility.resetResidenceState(withholdStateIncomeTax, residenceState); 
            }
        }

        Validation.ValidateForm(this.rmdFormGroup);
    }

    // Format currency values        
    emptyControls(controlList: any) {
        controlList.forEach(control => {
            control.setValue(null);
        });
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
    //#endregion

    //region Functional Method
    private get isValid(): boolean {
        let noElection = this.rmdFormGroup.controls[this.noElection].value;
        let distributedElection = this.rmdFormGroup.controls[this.distributionElection].value;

        if ((this.model.distributedElectionType == DistributedElectionType.New ||
            this.model.distributedElectionType == DistributedElectionType.Existing)
            && this.model.paymentType == PaymentType.ElectronicPayment) {
            if (this.model.paymentType == PaymentType.ElectronicPayment) {
                return ((noElection != NoElectionType.None)
                    || (distributedElection == DistributedElectionType.Terminate)
                    || this.rmdFormGroup.valid)
                    && (this.fileUploadModel.filter(x => x.fileValue).length > 0)
                    //To fix ALM-434, we also need to validate page by checking if there is no invalid/error file message.
                    && (!this.invalidFileErrorMessage || this.invalidFileErrorMessage.length <= 0);
            }
            else {
                return ((noElection != NoElectionType.None) || (distributedElection == DistributedElectionType.Terminate)
                    || this.rmdFormGroup.valid);
            }
        }
        else {
            return ((noElection != NoElectionType.None) || (distributedElection == DistributedElectionType.Terminate) || this.rmdFormGroup.valid);
        }
    }

    private emitResult() {
        let result = {
            RequestType: ServiceRequestType.RequestRequiredMinimumDistribution,
            RMDData: this.model,
            UploadedFile: this.fileUploadModel,
            ServiceDocuments: this.serviceDocuments,
            IsDataValid: this.isValid,
            UserComment: ''
        };
        this.formValueChanged.emit(result);
    }

    private setDefaultValue() {
        this.rmdFormGroup.controls[this.paymentOption].setValue(PaymentOption.CurrentYearOnly);
        this.rmdFormGroup.controls[this.paymentType].setValue(PaymentType.ElectronicPayment);
        this.rmdFormGroup.controls[this.accountType].setValue(null);  // ALM-368 (ALM-215)
        // this.rmdFormGroup.controls[this.accountType].setValue(AccountType.CheckingAccount);  // ALM-368 (ALM-215)

        let incomeTaxWithhold = this.rmdFormGroup.controls["incomeTaxWithhold"];
        incomeTaxWithhold.setValue(this.taxWithHoldingNeitherElectText);
        this.incomeTaxWithholdOption = TaxWithHoldingOption.NeitherElect.toString();

        let controls = this.rmdFormGroup.controls;
        this.utility.disableControls([controls["currenySignFederal"], controls["currenySignState"],
        controls["withholdFederalIncomeTax"], controls["withholdStateIncomeTax"], controls["residenceState"]]);

        // Filling default value of Fair Market Value
        this.setValueAsEmpty(this.fairMarketValue);
        this.makeFieldAsDecimal(this.fairMarketValue);

        this.makePaymentOptionMandatory(PaymentOption.CurrentYearOnly);
        this.makeBankInfoMandatory(PaymentType.ElectronicPayment);
        this.reinitalizeNoticeAndTaxControls();
        Validation.ValidateForm(this.rmdFormGroup);
    }

    private makeBankInfoMandatory(paymentType: PaymentType) {
        let isMandatory = (paymentType == PaymentType.ElectronicPayment);
        this.rmdFormGroup.controls[this.accountType].setValue(null);  // ALM-368 (ALM-215)
        // this.rmdFormGroup.controls[this.accountType].setValue(AccountType.CheckingAccount);  // ALM-368 (ALM-215)

        this.onError.emit("");
        this.invalidFileErrorMessage = "";

        if (!isMandatory) {
            this.makeValidatorEmpty(this.accountBankName);
            this.setValueAsEmpty(this.accountBankName);

            this.makeValidatorEmpty(this.accountTelephoneNumber);
            this.setValueAsEmpty(this.accountTelephoneNumber);

            this.makeValidatorEmpty(this.accountNumber);
            this.setValueAsEmpty(this.accountNumber);

            this.makeValidatorEmpty(this.accountBankRoutingNumber);
            this.setValueAsEmpty(this.accountBankRoutingNumber);

            // ALM-385 (ALM-215)
            this.makeValidatorEmpty(this.accountType);
            this.setValueAsEmpty(this.accountType);

            // ALM-407
            this.setFileUploadUnRequired();
        }
        else {
            this.makeFieldAsRequired(this.accountBankName, isMandatory);

            let controls = this.rmdFormGroup.controls;

            let accountTelephoneNumber = controls[this.accountTelephoneNumber];
            if (accountTelephoneNumber != null)
                accountTelephoneNumber.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.phoneNumberChkReg)]);

            let accountNumber = controls[this.accountNumber];
            if (accountNumber != null)
                accountNumber.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.minLength(6)]);

            let accountBankRoutingNumber = controls[this.accountBankRoutingNumber];
            if (accountBankRoutingNumber != null)
                accountBankRoutingNumber.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.minLength(9)]);

            // ALM-385 (ALM-215)
            let accountType = controls[this.accountType];
            if (accountType != null)
                accountType.setValidators([Validators.required]);

            // ALM-407
            this.setFileUploadRequired();
        }
    }

    private makePaymentOptionMandatory(paymentOption: PaymentOption) {
        if (paymentOption == PaymentOption.OwnCalculation) {
            this.makeFieldAsDecimal(this.ownCalculationDollarAmt, true);
            this.makeValidatorEmpty(this.jointLifeExpectancyDob);
            this.setValueAsEmpty(this.jointLifeExpectancyDob);
        }
        else if (paymentOption == PaymentOption.JointLifeExpectancy) {
            let controls = this.rmdFormGroup.controls;
            let control = controls[this.jointLifeExpectancyDob];
            if (control != null) {
                control.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.dobReg)]);
            }
            this.makeValidatorEmpty(this.ownCalculationDollarAmt);
            this.setValueAsEmpty(this.ownCalculationDollarAmt);
        }
        else {
            this.makeValidatorEmpty(this.jointLifeExpectancyDob);
            this.setValueAsEmpty(this.jointLifeExpectancyDob);

            this.makeValidatorEmpty(this.ownCalculationDollarAmt);
            this.setValueAsEmpty(this.ownCalculationDollarAmt);
        }
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
        let controls = this.rmdFormGroup.controls;

        let incomeTaxWithhold = controls["incomeTaxWithhold"];
        incomeTaxWithhold.setValue(this.taxWithHoldingNeitherElectText);
        this.incomeTaxWithholdOption = TaxWithHoldingOption.NeitherElect.toString();

        let currenySignFederal = controls["currenySignFederal"];
        let currenySignState = controls["currenySignState"];
        currenySignFederal.setValue(this.defaultCurrencySign);
        currenySignState.setValue(this.defaultCurrencySign);

        this.makeValidatorEmpty("withholdFederalIncomeTax");
        this.setValueAsEmpty("withholdFederalIncomeTax");

        this.makeValidatorEmpty("withholdStateIncomeTax");
        this.setValueAsEmpty("withholdStateIncomeTax");

        this.makeValidatorEmpty("residenceState");
        this.setValueAsEmpty("residenceState");
        Validation.ValidateForm(this.rmdFormGroup);
    }

    //#endregion

    //#region Page Helper Method
    private makeFieldAsRequired(controlName: string, isRequired: boolean = true) {
        let controls = this.rmdFormGroup.controls;
        let control = controls[controlName];
        if (control != null) {
            if (isRequired)
                control.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            else
                control.setValidators(null);
        }
    }

    private makeFieldAsDecimal(controlName: string, isRequired: boolean = true) {
        let controls = this.rmdFormGroup.controls;
        let control = controls[controlName];
        if (control != null) {
            if (isRequired)
                control.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithNoAllZeroInput]);
            else
                control.setValidators(null);
        }
    }

    private makeFieldAsNumeric(controlName: string, isRequired: boolean = true) {
        let controls = this.rmdFormGroup.controls;
        let control = controls[controlName];
        if (control != null) {
            if (isRequired)
                control.setValidators([Validation.ValidateNumericWithNoAllZeroInput]);
            else
                control.setValidators(null);
        }
    }

    private makeFieldAsPercent(controlName: string, isRequired: boolean = true) {
        let controls = this.rmdFormGroup.controls;
        let control = controls[controlName];
        if (control != null) {
            if (isRequired)
                control.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.percentReg), Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithNoAllZeroInput]);
            else
                control.setValidators(null);
        }
    }

    private setFieldMinLength(controlName: string, minLength: number, isRequired: boolean = true) {
        let controls = this.rmdFormGroup.controls;
        let control = controls[controlName];
        if (control != null) {
            if (isRequired)
                control.setValidators([Validators.minLength(minLength)]);
            else
                control.setValidators(null);
        }
    }

    private makeFieldAsDob(controlName: string, isRequired: boolean = true) {
        let controls = this.rmdFormGroup.controls;
        let control = controls[controlName];
        if (control != null) {
            if (isRequired)
                control.setValidators(Validation.ValidateDob);
            else
                control.setValidators(null);
        }
    }

    private makeValidatorEmpty(controlName: string) {
        let controls = this.rmdFormGroup.controls;
        let control = controls[controlName];
        if (control != null) {
            control.setValidators(null);
        }
    }

    private setValueAsEmpty(controlName: string) {
        let controls = this.rmdFormGroup.controls;
        let control = controls[controlName];
        if (control != null) {
            control.setValue(null);
        }
    }

    markControlsDirty(controlList: any) {
        controlList.forEach(control => {
            control.markAsTouched();
        });
    }

    removeControlsValidators(controlList: any) {
        controlList.forEach(control => {
            control.setValidators(null);
        });
    }

    private disableControl(controlName: string) {
        let controls = this.rmdFormGroup.controls;
        let control = controls[controlName];
        if (control != null) {
            control.disable();
        };
    }
    private enableControl(controlName: string) {
        let controls = this.rmdFormGroup.controls;
        let control = controls[controlName];
        if (control != null) {
            control.enable();
        };
    }

    private getPaymentOptionText(paymentOption: PaymentOption): string {
        let paymentOptionText: string = '';
        if (paymentOption == PaymentOption.CurrentYearOnly)
            paymentOptionText = this.currentYearPaymentOptionText;
        else if (paymentOption == PaymentOption.Annual)
            paymentOptionText = this.annualPaymentOptionText;
        else if (paymentOption == PaymentOption.JointLifeExpectancy)
            paymentOptionText = this.jointLifeExpectancyPaymentOptionText;
        else if (paymentOption == PaymentOption.Monthly)
            paymentOptionText = this.monthlyPaymentOptionText;
        else if (paymentOption == PaymentOption.OwnCalculation)
            paymentOptionText = this.ownCalculationPaymentOptionText;
        else if (paymentOption == PaymentOption.SemiAnnual)
            paymentOptionText = this.semiannualPaymentOptionText;

        return paymentOptionText;
    }

    private getPaymentOptionSubText(paymentOption: PaymentOption): string {
        let subText: string = '';
        if (paymentOption == PaymentOption.JointLifeExpectancy)
            subText = "Spouse's date of birth";
        else if (paymentOption == PaymentOption.OwnCalculation)
            subText = "Specific dollar amount";
        return subText;
    }

    private getPaymentOptionSubTextValue(paymentOption: PaymentOption): string {
        let subText: string = '';
        if (paymentOption == PaymentOption.JointLifeExpectancy) {
            subText = this.utility.TransformToDateFormat(this.model.jointLifeExpectancyDob);
        }
        else if (paymentOption == PaymentOption.OwnCalculation) {
            subText = this.utility.TransformToCurrencyFormat(this.model.ownCalculationDollarAmt);
        }

        return subText;
    }

    private getMethodDistributionText(distributionMethod: PaymentType): string {
        let text: string = '';

        if (distributionMethod == PaymentType.ElectronicPayment)
            text = "Account Deposit"
        else if (distributionMethod == PaymentType.ChequePayment)
            text = "Check";
        return text;
    }

    private getAccountTypeText(accountType: AccountType): string {
        let text: string = '';

        if (accountType == AccountType.SavingAccount)
            text = "Savings"
        else if (accountType == AccountType.CheckingAccount)
            text = "Checking ";
        return text;
    }

    // Format currency values
    private transformOwnCalculationDollarAmt(element: any) {
        this.formattedOwnCalculationDollarAmt = this.currencyPipe.transform(this.model.ownCalculationDollarAmt, null, '', '1.2-2');
        element.target.value = this.formattedOwnCalculationDollarAmt;
        element.target.maxLength = 17;
    }

    // Format currency values
    private normalizeOwnCalculationDollarAmt(element: any) {
        this.formattedOwnCalculationDollarAmt = this.model.ownCalculationDollarAmt ? this.model.ownCalculationDollarAmt.toString() : "";
        element.target.value = this.formattedOwnCalculationDollarAmt;
        element.target.maxLength = 11;
    }

    // Format currency values
    private transformFairMarketValue(element: any) {
        this.formattedFairMarketValue = this.currencyPipe.transform(this.model.fairMarketValue, null, '', '1.2-2');
        element.target.value = this.formattedFairMarketValue;
        element.target.maxLength = 17;
    }

    // Format currency values
    private normalizeFairMarketValue(element: any) {
        this.formattedFairMarketValue = this.model.fairMarketValue ? this.model.fairMarketValue.toString() : "";
        element.target.value = this.formattedFairMarketValue;
        element.target.maxLength = 11;
    }


    private transformWithholdFederalIncomeTaxAndChkValidationOnBlur(element: any) {
        let controls = this.rmdFormGroup.controls;
        this.transformWithholdFederalIncomeTax(element);
        this.utility.ChkValidateNumberWithDecimalAndLeadingZeroOnBlur(element, parseFloat(this.model.withholdFederalIncomeTax), controls["withholdFederalIncomeTax"], this.rmdFormGroup);

        if (controls["currenySignFederal"].value == '%') {
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
        let controls = this.rmdFormGroup.controls;
        if (controls["currenySignFederal"].value == '%') {
            this.utility.ChkValidationsOnFocus(controls["withholdFederalIncomeTax"], this.rmdFormGroup, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithAllZeroInput, Validators.pattern(Validation.percentReg)]);
        }
        else {
            this.utility.ChkValidationsOnFocus(controls["withholdFederalIncomeTax"], this.rmdFormGroup, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithAllZeroInput]);
        }
    }

    // Format currency values
    private transformWithholdFederalIncomeTax(element: any) {
        let controls = this.rmdFormGroup.controls;
        let currencySignFederal = controls["currenySignFederal"];
        this.formattedWithholdFederalIncomeTax = this.model.withholdFederalIncomeTax;

        if (currencySignFederal != undefined && currencySignFederal.value != '$') return;

        this.formattedWithholdFederalIncomeTax = this.currencyPipe.transform(this.model.withholdFederalIncomeTax, null, '', '1.2-2');
        element.target.value = this.formattedWithholdFederalIncomeTax;
        element.target.maxLength = 17;
    }

    // Format currency values
    private normalizeWithholdFederalIncomeTax(element: any) {
        let controls = this.rmdFormGroup.controls;
        let currencySignFederal = controls["currenySignFederal"];

        if (currencySignFederal != undefined && currencySignFederal.value != '$') return;

        this.formattedWithholdFederalIncomeTax = this.model.withholdFederalIncomeTax;
        element.target.value = this.formattedWithholdFederalIncomeTax;
        element.target.maxLength = 11;
    }

    private transformWithholdStateIncomeTaxAndChkValidationOnBlur(element: any) {
        this.transformWithholdStateIncomeTax(element);
        let controls = this.rmdFormGroup.controls;
        this.utility.ChkValidateNumberWithDecimalAndLeadingZeroOnBlur(element, parseFloat(this.model.withholdStateIncomeTax), controls["withholdStateIncomeTax"], this.rmdFormGroup);
        if (controls["currenySignState"].value == '%') {
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
        let controls = this.rmdFormGroup.controls;
        if (controls["currenySignState"].value == '%') {
            this.utility.ChkValidationsOnFocus(controls["withholdStateIncomeTax"], this.rmdFormGroup, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithAllZeroInput, Validators.pattern(Validation.percentReg)]);
        }
        else {
            this.utility.ChkValidationsOnFocus(controls["withholdStateIncomeTax"], this.rmdFormGroup, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithAllZeroInput]);
        }     
    }

    // Format currency values
    private transformWithholdStateIncomeTax(element: any) {
        let controls = this.rmdFormGroup.controls;
        let currencySignState = controls["currenySignState"];
        this.formattedWithholdStateIncomeTax = this.model.withholdStateIncomeTax;

        if (currencySignState != undefined && currencySignState.value != '$') return;

        this.formattedWithholdStateIncomeTax = this.currencyPipe.transform(this.model.withholdStateIncomeTax, null, '', '1.2-2');
        element.target.value = this.formattedWithholdStateIncomeTax;
        element.target.maxLength = 17;
    }

    // Format currency values
    private normalizeWithholdStateIncomeTax(element: any) {
        let controls = this.rmdFormGroup.controls;
        let currencySignState = controls["currenySignState"];

        if (currencySignState != undefined && currencySignState.value != '$') return;

        this.formattedWithholdStateIncomeTax = this.model.withholdStateIncomeTax;
        element.target.value = this.formattedWithholdStateIncomeTax;
        element.target.maxLength = 11;
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

    private clearIncomeTaxValues() {
        this.model.withholdFederalIncomeTax = null;
        this.model.withholdStateIncomeTax = null;
        this.formattedWithholdFederalIncomeTax = null;
        this.formattedWithholdStateIncomeTax = null;
    }

    //resetting residence state value on witholdStateIncomeTax keyup event
    private resetResidenceState() {       
        let controls = this.rmdFormGroup.controls;
        let withholdStateIncomeTax = controls["withholdStateIncomeTax"];       
        let residenceState = controls["residenceState"];
        this.utility.resetResidenceState(withholdStateIncomeTax, residenceState); 
    }   
    //#endregion
}