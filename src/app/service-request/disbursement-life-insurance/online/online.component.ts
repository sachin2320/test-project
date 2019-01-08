import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppConfig } from "app/configuration/app.config";
import { DecimalType } from "app/enums/decimal-conversion-enum";
import { PartialSurrenderType } from "app/enums/partial-surrender-type.enum";
import { ServiceRequestType } from "app/enums/service-type.enum";
import { SurrenderType } from "app/enums/surrender-type.enum";
import { TaxWithHoldingOption } from "app/enums/taxwithholding-option.enum";
import { CountryModel } from "app/models/country.model";
import { ServiceRequestLifeDisbursementModel } from "app/models/serviceRequestLifeDisbursement.model";
import { StateModel } from "app/models/state.model";
import { UtilityService } from 'app/services/helper/utility.service';
import { CommonService } from "app/shared-services/common.service";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'disbursement-of-life-insurance',
    styles: [],
    templateUrl: 'online.component.html'
})

export class ServiceRequestDisbursementLifeInsuranceOnlineComponent implements OnInit {
    stateModel: StateModel[] = [];
    residenceStateModel: StateModel[] = [];
    countryModel: CountryModel[] = [];
    withHoldValidations: any[];

    @Input('isviewonly') isViewOnly: boolean = false;

    public model: ServiceRequestLifeDisbursementModel = null;
    public disbursementLifeInsuranceForm: FormGroup = null;

    public userComment: string = "";
    public isPageValid: boolean = true;
    public defaultCountry: string = "";
    public dateFormat: string;
    @Output('onvaluechanged')
    formValue = new EventEmitter();
    public isAddressReadOnly: boolean = true;
    public isLoanDeliveryReadOnly: boolean = true;
    public isLoanAmountReadOnly: boolean = true;
    public isIncomeTaxReadOnly: boolean = true;
    public isPartialSurrenderAmountReadOnly: boolean = true;
    public isPolicyOrInterestTransferredReadOnly: boolean = true;
    public zipMaxLength: number = 10; // 5;
    public isPartialSurrender: boolean = false;
    public isFullSurrender: boolean = false;
    public DecimalType = DecimalType;

    public incomeTaxWithhold: string = 'incomeTaxWithhold';
    public taxWithHoldingNotElectText: string = "";
    public taxWithHoldingElectText: string = "";
    public taxWithHoldingNeitherElectText: string = "";
    public incomeTaxWithholdOption: string = "";
    public taxWithHoldingOption = TaxWithHoldingOption;

    public partialSurrenderTypeText = "";
    public fullSurrenderTypeText = "";
    public ownersAddressSameText: string = "";
    public ownersAddressNewText: string = "";
    public deliveryOptionStandardText: string = "";
    public deliveryOptionOvernightText: string = "";
    public partialSurrenderAmountText: string = "";
    public partialSurrenderMaximumAmountText: string = "";
    public partialSurrenderMaximumAvailableAmountText: string = "";
    public grossAmountForPartialSurrenderText: string = "";
    public netAmountForPartialSurrenderText: string = "";
    public agreeToReturnPolicyText = "";
    public policyLostText = "";
    public absoluteAssignmentTypeText = "";
    public collateralAssignmentTypeText = "";
    public policyInterestNotTransferredText = "";
    public policyInterestTransferredText = "";
    public agreeToSurrenderChargesText = "";
    public agreeToOptOutOfAssessmentAccountText = "";
    public formattedPartialSurrenderAmount = "";

    public errorMessage: string;
    public isValidWithHold: boolean = true;

    constructor(private formBuilder: FormBuilder, public config: AppConfig, private spinner: SpinnerService,
        private commonService: CommonService,
        private notification: SnackbarService,
        private utility: UtilityService,
        private currencyPipe: CurrencyPipe) {
        this.dateFormat = this.config.getConfig("date_format");
        this.defaultCountry = this.config.getConfig("default_country");
        this.model = this.model == null ? new ServiceRequestLifeDisbursementModel() : this.model;
    }

    ngOnInit() {
        this.getCountry();
        this.setFormProperties();
        this.setupFormFields();
        this.initializeInputs();
        this.withHoldValidations = [Validation.ValidateRequiredWithNoEmptySpaceInput,
        Validation.ValidateNumericWithNoAllZeroInput,
        Validators.pattern(Validation.threeDecimalDigitReg)];

        //Raising invalid form state event.
        this.formValue.emit({ FormData: this.model });
        this.disbursementLifeInsuranceForm.valueChanges.subscribe(form => {
            if (!this.isViewOnly) {
                this.isPageValid = this.disbursementLifeInsuranceForm.valid;
                this.model = form;
                this.emitResult();
            }
        });
        this.disbursementLifeInsuranceForm.get('isAddressSame').updateValueAndValidity();
    }

    //set form properties text from json file
    setFormProperties() {
        this.taxWithHoldingNotElectText = this.utility.getConfigText("election_of_tax_with_holding_not_elect");
        this.taxWithHoldingElectText = this.utility.getConfigText("election_of_tax_with_holding_elect");
        this.taxWithHoldingNeitherElectText = this.utility.getConfigText("election_of_tax_with_holding_neither_elect");

        this.partialSurrenderTypeText = this.utility.getConfigText("qasw_premiumType_" + SurrenderType.Partial);
        this.fullSurrenderTypeText = this.utility.getConfigText("qasw_premiumType_" + SurrenderType.Full);
        this.ownersAddressSameText = this.utility.getConfigText("dli_isAddressSame_1");
        this.ownersAddressNewText = this.utility.getConfigText("dli_isAddressSame_0");
        this.deliveryOptionStandardText = this.utility.getConfigText("dli_isLoanDeliveryStandard_1");
        this.deliveryOptionOvernightText = this.utility.getConfigText("dli_isLoanDeliveryStandard_0");
        this.partialSurrenderMaximumAmountText = this.utility.getConfigText("dli_partialSurrenderType_1");
        this.partialSurrenderAmountText = this.utility.getConfigText("dli_partialSurrenderType_2");
        this.partialSurrenderMaximumAvailableAmountText = this.utility.getConfigText("dli_partialSurrenderType_3");
        this.grossAmountForPartialSurrenderText = this.utility.getConfigText("dli_isGrossAmountForPartialSurrender_1");
        this.netAmountForPartialSurrenderText = this.utility.getConfigText("dli_isGrossAmountForPartialSurrender_0");
        this.agreeToReturnPolicyText = this.utility.getConfigText("dli_isAgreeToReturnPolicyByEmail_1");
        this.policyLostText = this.utility.getConfigText("dli_isAgreeToReturnPolicyByEmail_0");
        this.policyInterestNotTransferredText = this.config.getConfig("dli_isPolicyOrInterestTransferred_1");
        this.policyInterestTransferredText = this.config.getConfig("dli_isPolicyOrInterestTransferred_0");
        this.absoluteAssignmentTypeText = this.config.getConfig("dli_isAbsoluteAssignmentType_1");
        this.collateralAssignmentTypeText = this.config.getConfig("dli_isAbsoluteAssignmentType_0");
        this.agreeToSurrenderChargesText = this.utility.getConfigText("dli_isAgreeForFullSurrenderCharges_1");
        this.agreeToOptOutOfAssessmentAccountText = this.utility.getConfigText("dli_isAgreeToOptOutOfAssetAccount_1");
    }

    setupFormFields() {
        this.disbursementLifeInsuranceForm = this.formBuilder.group({
            isAddressSame: [this.model.isAddressSame],
            street: [this.model.street],
            city: [this.model.city],
            country: [this.model.country == "" ? this.defaultCountry : this.model.country],
            state: [this.model.state],
            zipCode: [this.model.zipCode],
            carrier: [this.model.carrier],
            accountNumber: [this.model.accountNumber],
            isLoanDeliveryStandard: [this.model.isLoanDeliveryStandard],
            surrenderType: [this.model.surrenderType, Validators.required],
            partialSurrenderType: [this.model.partialSurrenderType],
            partialSurrenderAmount: [this.model.partialSurrenderAmount],
            isGrossAmountForPartialSurrender: [this.model.isGrossAmountForPartialSurrender],
            isAgreeForFullSurrenderCharges: [this.model.isAgreeForFullSurrenderCharges],
            isAgreeToOptOutOfAssetAccount: [this.model.isAgreeToOptOutOfAssetAccount],
            isAgreeToReturnPolicyByEmail: [this.model.isAgreeToReturnPolicyByEmail],
            isPolicyOrInterestTransferred: [this.model.isPolicyOrInterestTransferred],
            nameOfAssignee: [this.model.nameOfAssignee],
            dateOfAssignment: [this.model.dateOfAssignment],
            isAbsoluteAssignmentType: [this.model.isAbsoluteAssignmentType],
            incomeTaxWithhold: [this.model.incomeTaxWithhold],
            withholdFederalIncomeTax: [this.model.withholdFederalIncomeTax],
            withholdStateIncomeTax: [this.model.withholdStateIncomeTax],
            residenceState: [this.model.residenceState],
        }, {
                validator: (formGroup: FormGroup) => {
                    formGroup.controls.dateOfAssignment.valueChanges.subscribe(() => {
                        Validation.ValidateDateLessThanCurrent(formGroup.controls.dateOfAssignment);
                    });
                }
            });

    }

    initializeInputs() {
        this.disbursementLifeInsuranceForm.controls["isAddressSame"].setValue("true");
        this.disbursementLifeInsuranceForm.controls["isLoanDeliveryStandard"].setValue("true");
        this.disbursementLifeInsuranceForm.controls["isPolicyOrInterestTransferred"].setValue("true");
        this.disbursementLifeInsuranceForm.controls["isAgreeToReturnPolicyByEmail"].setValue("true");
        this.disbursementLifeInsuranceForm.controls["isGrossAmountForPartialSurrender"].setValue("true");
        this.disbursementLifeInsuranceForm.controls["incomeTaxWithhold"].setValue(this.taxWithHoldingNeitherElectText);
        this.incomeTaxWithholdOption = TaxWithHoldingOption.NeitherElect.toString();
        this.disbursementLifeInsuranceForm.controls["partialSurrenderType"].setValue(PartialSurrenderType.MaximumPartialSurrender.toString());
    }
    private getState(countryCode: string) {
        this.stateModel = this.countryModel.filter(x => x.code == countryCode)[0].states;

    }
    private getResidenceState(countryCode: string) {
        this.residenceStateModel = this.countryModel.filter(x => x.code == countryCode)[0].states;

    }
    onCountryChange(event) {
        let controls = this.disbursementLifeInsuranceForm.controls;
        controls["state"].setValue(null);
        this.getState(event.value);
        this.zipMaxLength = Validation.ValidateZipCodeAsPerCountrySelected(controls["zipCode"], event.value);
        Validation.ValidateForm(this.disbursementLifeInsuranceForm);
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
            RequestType: ServiceRequestType.DisbursementLifeInsurance,
            DisbursementLifeInsuranceData: this.model,
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

    onIncomeWithHoldChanged(event) {
        if (!event.target) {
            this.isValidWithHold = true;
            let controls = this.disbursementLifeInsuranceForm.controls;
            let incomeTaxWithhold = this.incomeTaxWithholdOption = event.source != undefined ? event.source.id : TaxWithHoldingOption.Elect;
            let withholdFederalIncomeTax = controls["withholdFederalIncomeTax"];
            let withholdStateIncomeTax = controls["withholdStateIncomeTax"];
            let residenceState = controls["residenceState"];

            if (incomeTaxWithhold == TaxWithHoldingOption.NotElect || incomeTaxWithhold == TaxWithHoldingOption.NeitherElect) {
                if (incomeTaxWithhold == TaxWithHoldingOption.NotElect) {
                    this.incomeTaxWithhold = this.taxWithHoldingNotElectText;
                }
                else {
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
            Validation.ValidateForm(this.disbursementLifeInsuranceForm);
        }
    }

    onSurrenderTypeChange(event: any) {
        let controls = this.disbursementLifeInsuranceForm.controls;
        let surrenderType = controls["surrenderType"].value;
        let partialSurrenderAmount = controls["partialSurrenderAmount"];
        let partialSurrenderType = controls["partialSurrenderType"].value;

        let isAgreeForFullSurrenderCharges = controls["isAgreeForFullSurrenderCharges"];
        let isAgreeToOptOutOfAssetAccount = controls["isAgreeToOptOutOfAssetAccount"];
        let isAgreeToReturnPolicyByEmail = controls["isAgreeToReturnPolicyByEmail"];

        let nameOfAssignee = controls["nameOfAssignee"];
        let dateOfAssignment = controls["dateOfAssignment"];
        let isAbsoluteAssignmentType = controls["isAbsoluteAssignmentType"];

        if (surrenderType == SurrenderType.Partial) {
            this.utility.EmptyControls([nameOfAssignee, dateOfAssignment]);
            this.removeControlsValidators([nameOfAssignee, dateOfAssignment, isAgreeToOptOutOfAssetAccount, isAgreeForFullSurrenderCharges]);

            controls["isPolicyOrInterestTransferred"].setValue("true");
            isAgreeToReturnPolicyByEmail.setValue("true");
            isAbsoluteAssignmentType.setValue("true");
            isAgreeToOptOutOfAssetAccount.setValue(false);
            isAgreeForFullSurrenderCharges.setValue(false);
        }
        else if (surrenderType == SurrenderType.Full) {
            isAgreeForFullSurrenderCharges.setValidators(Validators.requiredTrue);
            this.utility.EmptyControls([partialSurrenderAmount]);
            this.removeControlsValidators([partialSurrenderAmount]);
            this.disbursementLifeInsuranceForm.controls["partialSurrenderType"].setValue(PartialSurrenderType.MaximumPartialSurrender.toString());
            controls["isGrossAmountForPartialSurrender"].setValue("true");
            this.formattedPartialSurrenderAmount = null;
        }
        Validation.ValidateForm(this.disbursementLifeInsuranceForm);
    }

    onPartialSurrenderChanged(event: any) {
        let controls = this.disbursementLifeInsuranceForm.controls;
        let partialSurrenderAmount = controls["partialSurrenderAmount"];
        let partialSurrenderType = controls["partialSurrenderType"].value;

        if (partialSurrenderType != PartialSurrenderType.PartialSurrenderAmount) {
            this.isPartialSurrenderAmountReadOnly = true;
            this.utility.EmptyControls([partialSurrenderAmount]);
            this.removeControlsValidators([partialSurrenderAmount]);
        }
        else {
            this.isPartialSurrenderAmountReadOnly = false;
            partialSurrenderAmount.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.decimalReg), Validation.ValidateNumericWithNoAllZeroInput]);
        }
        Validation.ValidateForm(this.disbursementLifeInsuranceForm);
    }

    onPolicyOrInterestTransferredChanged() {
        let controls = this.disbursementLifeInsuranceForm.controls;
        let isPolicyOrInterestTransferred = this.model.isAddressSame == undefined ? true : Boolean(JSON.parse(controls["isPolicyOrInterestTransferred"].value));

        let nameOfAssignee = controls["nameOfAssignee"];
        let dateOfAssignment = controls["dateOfAssignment"];
        let isAbsoluteAssignmentType = controls["isAbsoluteAssignmentType"];

        if (!isPolicyOrInterestTransferred) {
            this.isPolicyOrInterestTransferredReadOnly = false;
            nameOfAssignee.setValidators(Validators.required);
            dateOfAssignment.setValidators(Validators.required);
            isAbsoluteAssignmentType.setValue('true');
        }
        else {
            isAbsoluteAssignmentType.setValue(null);
            this.isPolicyOrInterestTransferredReadOnly = true;
            this.utility.EmptyControls([nameOfAssignee, dateOfAssignment]);
            this.removeControlsValidators([nameOfAssignee, dateOfAssignment]);
        }

        Validation.ValidateForm(this.disbursementLifeInsuranceForm);
    }

    setControlValidator() {
        let controls = this.disbursementLifeInsuranceForm.controls;
        let isAddressSame = this.model.isAddressSame == undefined ? true : Boolean(JSON.parse(controls["isAddressSame"].value));
        let street = controls["street"];
        let city = controls["city"];
        let country = controls["country"];
        let state = controls["state"];
        let zipCode = controls["zipCode"];
        let isLoanDeliveryStandard = this.model.isLoanDeliveryStandard == undefined ? true : Boolean(JSON.parse(controls["isLoanDeliveryStandard"].value));
        let carrier = controls["carrier"];
        let accountNumber = controls["accountNumber"];

        if (!isAddressSame) {
            this.isAddressReadOnly = false;
            street.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            city.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            country.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            state.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            this.zipMaxLength = Validation.ValidateZipCodeAsPerCountrySelected(zipCode, country.value);
        }
        else if (isAddressSame) {
            this.isAddressReadOnly = true;
            this.utility.EmptyControls([street, city, country, state, zipCode]);
            this.removeControlsValidators([street, city, country, state, zipCode]);
            country.setValue(this.defaultCountry);
            this.getState(this.defaultCountry);
        }
        if (!isLoanDeliveryStandard) {
            this.isLoanDeliveryReadOnly = false;
            accountNumber.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.pattern(Validation.overNightDelayAccountNumber)]);
            carrier.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.carrierName)]);
        }
        else if (isLoanDeliveryStandard) {
            this.isLoanDeliveryReadOnly = true;
            this.utility.EmptyControls([accountNumber, carrier]);
            this.removeControlsValidators([accountNumber, carrier]);
        }
        Validation.ValidateForm(this.disbursementLifeInsuranceForm);
    }

    removeControlsValidators(controlList: any) {
        controlList.forEach(control => {
            control.setValidators(null);
        });
    }

    // Format currency values
    private transformAmount(element: any) {
        this.formattedPartialSurrenderAmount = this.currencyPipe.transform(this.model.partialSurrenderAmount, null, '', '1.2-2');
        element.target.value = this.formattedPartialSurrenderAmount;
        element.target.maxLength = 17;
    }

    // Format currency values
    private normalizeAmount(element: any) {
        this.formattedPartialSurrenderAmount = this.model.partialSurrenderAmount;
        element.target.value = this.formattedPartialSurrenderAmount;
        element.target.maxLength = 11;
    }

    //ALM #437
    private validateWithHoldValue(event: any) {
        if (!this.isIncomeTaxReadOnly) {
            let result: any = this.utility.ValidateWithHoldITValueBtwFederalAndState(this.disbursementLifeInsuranceForm, this.withHoldValidations);
            this.isValidWithHold = result.IsValidWithHold;
            this.errorMessage = result.ErrorMessage;
            Validation.ValidateForm(this.disbursementLifeInsuranceForm);
        }
    }

    get isDisableState(): boolean {
        let withholdFederalIncomeTaxValue = parseFloat(this.utility.RemoveExtraDecimalAndLeadingZero(this.disbursementLifeInsuranceForm.controls["withholdFederalIncomeTax"].value));
        let withholdStateIncomeTaxValue = parseFloat(this.utility.RemoveExtraDecimalAndLeadingZero(this.disbursementLifeInsuranceForm.controls["withholdStateIncomeTax"].value));
        return withholdFederalIncomeTaxValue <= 100
            && (withholdStateIncomeTaxValue === 0) ? true : false;
    }

    private transformWithholdIncomeTaxAndChkValidationOnBlur(event: any) {
        if (event.target.value) {
            let controls = this.disbursementLifeInsuranceForm.controls;
            let withholdIncomeTaxControl = controls[event.target.name];
            withholdIncomeTaxControl.setValue(this.utility.RemoveExtraDecimalAndLeadingZero(parseFloat(event.target.value)));
            this.validateWithHoldValue(null);
        }
    }
}