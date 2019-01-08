import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AppConfig } from "app/configuration/app.config";
import { Validation } from "app/shared-services/validation.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ServiceRequestType } from "app/enums/service-type.enum";
import { ServiceRequestLifeLoanModel } from 'app/models/serviceRequestLifeLoan.model';
import { StateModel } from 'app/models/state.model';
import { CountryModel } from 'app/models/country.model';
import { SpinnerService } from 'app/shared-services/spinner.service';
import { CommonService } from 'app/shared-services/common.service';
import { SnackbarService } from 'app/shared-services/snackbar.service';
import { DecimalType } from "app/enums/decimal-conversion-enum";
import { TaxWithHoldingOption } from 'app/enums/taxwithholding-option.enum';
import { UtilityService } from 'app/services/helper/utility.service';
import { ValueTransformer } from '@angular/compiler/src/util';
import { preserveWhitespacesDefault } from '@angular/compiler';

@Component({
    selector: 'life-loan',
    styles: [],
    templateUrl: 'online.component.html'
})

export class ServiceRequestLifeLoanOnlineComponent implements OnInit {
    stateModel: StateModel[] = [];
    residenceStateModel: StateModel[] = [];
    countryModel: CountryModel[] = [];
    withHoldValidations: any[];

    @Input('isviewonly') isViewOnly: boolean = false;
    @Input('policyNumber') policyNumber: string = "";

    public model: ServiceRequestLifeLoanModel = null;
    public LifeLoanForm: FormGroup = null;
    public userComment: string = "";
    public isPageValid: boolean = true;
    public defaultCountry: string = "";
    public dateFormat: string;
    @Output('onvaluechanged')
    formValue = new EventEmitter();
    public isAddressReadonly: boolean = true;
    public isLoanDeliveryReadonly: boolean = true;
    public isLoanAmountReadonly: boolean = true;
    public isIncomeTaxReadOnly: boolean = true;
    public isStateIncomeReadonly: boolean = true;
    public zipMaxLength: number = 10; // 5;
    public incomeTaxWithhold: string = 'incomeTaxWithhold';
    public taxWithHoldingNotElectText: string = "";
    public taxWithHoldingElectText: string = "";
    public taxWithHoldingNeitherElectText: string = "";
    public incomeTaxWithholdOption: string = "";
    public TaxWithHoldingOption = TaxWithHoldingOption;

    public DecimalType = DecimalType;

    public ownersAddressSameText: string = "";
    public ownersAddressNewText: string = "";
    public loanDeliveryOptionStandardText: string = "";
    public loanDeliveryOptionOvernightText: string = "";
    public loanAmountRequestMaximumText: string = "";
    public loanAmountRequestSpecificText: string = "";
    public loanTypeFixedText: string = "";
    public loanTypeVariableText: string = "";
    public formattedSpecificLoanAmount: string = "";

    public errorMessage: string;
    public isValidWithHold: boolean = true;

    constructor(private formBuilder: FormBuilder,
        public config: AppConfig,
        private spinner: SpinnerService,
        private commonService: CommonService,
        private notification: SnackbarService,
        private utility: UtilityService,
        private currencyPipe: CurrencyPipe) {
        this.dateFormat = this.config.getConfig("date_format");
        this.defaultCountry = this.config.getConfig("default_country");
        this.model = this.model == null ? new ServiceRequestLifeLoanModel() : this.model;
        this.taxWithHoldingNotElectText = this.utility.getConfigText("election_of_tax_with_holding_not_elect");
        this.taxWithHoldingElectText = this.utility.getConfigText("election_of_tax_with_holding_elect");
        this.taxWithHoldingNeitherElectText = this.utility.getConfigText("election_of_tax_with_holding_neither_elect");

        this.ownersAddressSameText = this.utility.getConfigText("loan_owners_address_same");
        this.ownersAddressNewText = this.utility.getConfigText("loan_owners_address_new");
        this.loanDeliveryOptionStandardText = this.utility.getConfigText("loan_delivery_option_standard");
        this.loanDeliveryOptionOvernightText = this.utility.getConfigText("loan_delivery_option_overnight");
        this.loanAmountRequestMaximumText = this.utility.getConfigText("loan_amount_request_maximum");
        this.loanAmountRequestSpecificText = this.utility.getConfigText("loan_amount_request_specific");
        this.loanTypeFixedText = this.utility.getConfigText("loan_type_fixed");
        this.loanTypeVariableText = this.utility.getConfigText("loan_type_variable");
    }

    ngOnInit() {
        this.getCountry();
        this.setupFormFields();
        this.initializeInputs();
        this.withHoldValidations = [Validation.ValidateRequiredWithNoEmptySpaceInput,
        Validation.ValidateNumericWithNoAllZeroInput,
        Validators.pattern(Validation.threeDecimalDigitReg)];

        //Raising invalid form state event.
        this.formValue.emit({ FormData: this.model });
        this.LifeLoanForm.valueChanges.subscribe(form => {
            if (!this.isViewOnly) {
                this.isPageValid = this.LifeLoanForm.valid;
                this.model = form;
                this.emitResult();
            }
        });
        this.LifeLoanForm.get('isAddressSame').updateValueAndValidity();
    }

    setupFormFields() {
        this.LifeLoanForm = this.formBuilder.group({
            isAddressSame: [this.model.isAddressSame],
            street: [this.model.street],
            city: [this.model.city],
            country: [this.model.country == "" ? this.defaultCountry : this.model.country],
            state: [this.model.state],
            zipCode: [this.model.zipCode],
            carrier: [this.model.carrier],
            accountNumber: [this.model.accountNumber],
            isLoanDeliveryStandard: [this.model.isLoanDeliveryStandard],
            isLoanAmountRequestMaximum: [this.model.isLoanAmountRequestMaximum],
            specificLoanAmount: [this.model.specificLoanAmount],
            isLoanTypeFixed: [this.model.isLoanTypeFixed],
            incomeTaxWithhold: [this.model.incomeTaxWithhold],
            withholdFederalIncomeTax: [this.model.withholdFederalIncomeTax],
            withholdStateIncomeTax: [this.model.withholdStateIncomeTax],
            residenceState: [this.model.residenceState],
            ownersAddress: [this.model.ownersAddress],
            loanDeliveryType: [this.model.loanDeliveryType],
            loanAmountRequest: [this.model.loanAmountRequest]
        });

    }
    initializeInputs() {
        this.LifeLoanForm.controls["isAddressSame"].setValue("true");
        this.LifeLoanForm.controls["isLoanDeliveryStandard"].setValue("true");
        this.LifeLoanForm.controls["isLoanAmountRequestMaximum"].setValue("true");
        this.LifeLoanForm.controls["isLoanTypeFixed"].setValue("true");
        this.LifeLoanForm.controls["incomeTaxWithhold"].setValue(this.taxWithHoldingNeitherElectText);
        this.incomeTaxWithholdOption = TaxWithHoldingOption.NeitherElect.toString();
    }

    private getState(countryCode: string) {
        this.stateModel = this.countryModel.filter(x => x.code == countryCode)[0].states;

    }
    private getResidenceState(countryCode: string) {
        this.residenceStateModel = this.countryModel.filter(x => x.code == countryCode)[0].states;

    }
    onCountryChange(event) {
        let controls = this.LifeLoanForm.controls;
        controls["state"].setValue(null);
        this.getState(event.value);
        this.zipMaxLength = Validation.ValidateZipCodeAsPerCountrySelected(controls["zipCode"], event.value);
        Validation.ValidateForm(this.LifeLoanForm);
    }
    private getCountry() {
        this.spinner.start();
        this.commonService.getCountries().subscribe(results => {
            this.spinner.stop();
            this.countryModel = results;
            this.getState(this.defaultCountry);
            this.getResidenceState('US');
        }, error => {
            this.spinner.stop();
            this.notification.popupSnackbar(error);
        });
    }

    emitResult(comment: any = "") {
        let result = {
            RequestType: ServiceRequestType.LifeLoan,
            LifeLoanData: this.model,
            IsDataValid: this.pageIsValid,
            UserComment: comment == "" ? this.userComment : comment
        };
        this.formValue.emit(result);
    }

    get pageIsValid(): boolean {
        return this.isPageValid && this.isValidWithHold;
    }
    onAddressTypeChange(event) {
        this.setControlValidator();
    }
    onLoanDeliveryTypeChange(event) {
        this.setControlValidator();

    }
    onLoanAmountRequestChange(event) {
        this.setControlValidator();
    }

    onIncomeWithHoldChanged(event) {
        if (!event.target) {
            this.isValidWithHold = true;
            let controls = this.LifeLoanForm.controls;
            let incomeTaxWithhold = this.incomeTaxWithholdOption = event.source != undefined ? event.source.id : TaxWithHoldingOption.Elect;
            let withholdFederalIncomeTax = controls["withholdFederalIncomeTax"];
            let withholdStateIncomeTax = controls["withholdStateIncomeTax"];
            let residenceState = controls["residenceState"];

            if (incomeTaxWithhold == TaxWithHoldingOption.NotElect || incomeTaxWithhold == TaxWithHoldingOption.NeitherElect) {
                if (incomeTaxWithhold == TaxWithHoldingOption.NotElect) {
                    incomeTaxWithhold = this.taxWithHoldingNotElectText;
                }
                else if (incomeTaxWithhold == TaxWithHoldingOption.NeitherElect) {
                    this.incomeTaxWithhold = this.taxWithHoldingNeitherElectText;
                }
                this.isIncomeTaxReadOnly = true;
                this.utility.EmptyControls([withholdFederalIncomeTax, withholdStateIncomeTax, residenceState]);
                this.removeControlsValidators([withholdFederalIncomeTax, withholdStateIncomeTax, residenceState]);
                this.errorMessage = null;
            }
            else if (incomeTaxWithhold == TaxWithHoldingOption.Elect) {
                this.isIncomeTaxReadOnly = false;
                this.incomeTaxWithhold = this.taxWithHoldingElectText;
                withholdFederalIncomeTax.setValidators(this.withHoldValidations);
                withholdStateIncomeTax.setValidators(this.withHoldValidations);
                residenceState.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            }
            Validation.ValidateForm(this.LifeLoanForm);
        }
    }

    setControlValidator() {
        let controls = this.LifeLoanForm.controls;
        let isAddressSame = this.model.isAddressSame == undefined ? true : Boolean(JSON.parse(controls["isAddressSame"].value));
        let street = controls["street"];
        let city = controls["city"];
        let country = controls["country"];
        let state = controls["state"];
        let zipCode = controls["zipCode"];

        let isLoanDeliveryStandard = this.model.isLoanDeliveryStandard == undefined ? true : Boolean(JSON.parse(controls["isLoanDeliveryStandard"].value));
        let carrier = controls["carrier"];
        let accountNumber = controls["accountNumber"];

        let isLoanAmountRequestMaximum = this.model.isLoanAmountRequestMaximum == undefined ? true : Boolean(JSON.parse(controls["isLoanAmountRequestMaximum"].value));
        let specificLoanAmount = controls["specificLoanAmount"];

        let withholdFederalIncomeTax = controls["withholdFederalIncomeTax"];
        let withholdStateIncomeTax = controls["withholdStateIncomeTax"];
        let residenceState = controls["residenceState"];

        if (!isAddressSame) {
            this.isAddressReadonly = false;
            street.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            city.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            country.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            state.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            this.zipMaxLength = Validation.ValidateZipCodeAsPerCountrySelected(zipCode, country.value)
        }
        else if (isAddressSame) {
            this.isAddressReadonly = true;
            this.utility.EmptyControls([street, city, country, state, zipCode]);
            this.removeControlsValidators([street, city, country, state, zipCode]);
            country.setValue(this.defaultCountry);
            this.getState(this.defaultCountry);
        }
        if (!isLoanDeliveryStandard) {
            this.isLoanDeliveryReadonly = false;
            accountNumber.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.pattern(Validation.overNightDelayAccountNumber)]);
            carrier.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.carrierName)]);
        }
        else if (isLoanDeliveryStandard) {
            this.isLoanDeliveryReadonly = true;
            this.utility.EmptyControls([accountNumber, carrier]);
            this.removeControlsValidators([accountNumber, carrier]);
        }
        if (!isLoanAmountRequestMaximum) {
            this.isLoanAmountReadonly = false;
            specificLoanAmount.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithNoAllZeroInput]);
        }
        else if (isLoanAmountRequestMaximum) {
            this.isLoanAmountReadonly = true;
            this.utility.EmptyControls([specificLoanAmount]);
            this.removeControlsValidators([specificLoanAmount]);
        }
        Validation.ValidateForm(this.LifeLoanForm);
    }

    removeControlsValidators(controlList: any) {
        controlList.forEach(control => {
            control.setValidators(null);
        });
    }

    // Format currency values
    private transformAmount(element: any) {
        this.formattedSpecificLoanAmount = this.currencyPipe.transform(this.model.specificLoanAmount, null, '', '1.2-2');
        element.target.value = this.formattedSpecificLoanAmount;
        element.target.maxLength = 17;
    }

    // Format currency values
    private normalizeAmount(element: any) {
        this.formattedSpecificLoanAmount = this.model.specificLoanAmount;
        element.target.value = this.formattedSpecificLoanAmount;
        element.target.maxLength = 11;
    }

    //ALM #437
    private validateWithHoldValue(event: any) {
        if (!this.isIncomeTaxReadOnly) {
            let result: any = this.utility.ValidateWithHoldITValueBtwFederalAndState(this.LifeLoanForm, this.withHoldValidations);
            this.isValidWithHold = result.IsValidWithHold;
            this.errorMessage = result.ErrorMessage;
            Validation.ValidateForm(this.LifeLoanForm);
        }
    }

    get isDisableState(): boolean {
        let withholdFederalIncomeTaxValue = parseFloat(this.utility.RemoveExtraDecimalAndLeadingZero(this.LifeLoanForm.controls["withholdFederalIncomeTax"].value));
        let withholdStateIncomeTaxValue = parseFloat(this.utility.RemoveExtraDecimalAndLeadingZero(this.LifeLoanForm.controls["withholdStateIncomeTax"].value));
        return withholdFederalIncomeTaxValue <= 100
            && (withholdStateIncomeTaxValue === 0) ? true : false;
    }

    private transformWithholdIncomeTaxAndChkValidationOnBlur(event: any) {
        if (event.target.value) {
            let controls = this.LifeLoanForm.controls;
            let withholdIncomeTaxControl = controls[event.target.name];
            withholdIncomeTaxControl.setValue(this.utility.RemoveExtraDecimalAndLeadingZero(parseFloat(event.target.value)));
            this.validateWithHoldValue(null);
        }
    }
}