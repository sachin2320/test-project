import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppConfig } from "app/configuration/app.config";
import { Beneficiary } from "app/models/beneficiary.model";
import { CountryModel } from 'app/models/country.model';
import { StateModel } from 'app/models/state.model';
import { UtilityService } from 'app/services/helper/utility.service';
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'new-beneficiary',
    templateUrl: './newBeneficiary.component.html',
})

export class NewBeneficiaryComponent implements OnInit {
    @Input('statemodel') stateModel: StateModel[] = [];
    @Input('countrymodel') countryModel: CountryModel[] = [];
    @Input('model') model: Beneficiary = null;
    @Input('componentid') componentId: string = "";
    @Input('viewonly') viewOnly: boolean = false;
    @Input('isprintonly') isPrintOnly: boolean = false;
    @Input('isbenefitvalid') isBenefitValid: boolean = false;

    @Output('onComponentValidated')
    dataIsValid = new EventEmitter();

    @Output('onRemoved')
    removeComponent = new EventEmitter();

    @Output('onComponentValueChanged')
    formValue = new EventEmitter();

    beneficiaryInfoForm: FormGroup = null;

    public isIndividual: boolean = true;
    public isPrevious: boolean = false;
    public ssnInputsToFormat: number = 0;

    public defaultCountry: string = "";
    public dateFormat: string;
    public zipMaxLength: number = 10; // 5;
    public ssnPlaceholder = "Social Security Number*";

    public individualText = "";
    public nonNaturalText = "";
    public insuredOrAnnuitantText = "";
    public ownerText = "";

    isChangeDueToValidChange: boolean = false;

    constructor(private formBuilder: FormBuilder,
        public config: AppConfig,
        private utility: UtilityService
    ) {
        this.dateFormat = this.config.getConfig("date_format");
        this.defaultCountry = this.config.getConfig("default_country");
        this.model = this.model == null ? new Beneficiary() : this.model;
        this.componentId = this.componentId == "" ? this.getRandomInt(1, 5000) : this.componentId;
    }

    ngAfterViewChecked() {
        if (this.isPrevious == true) {
            if (this.ssnInputsToFormat == $("input[formcontrolname='ssn']").length) {
                this.isPrevious = false;
                $.each($("input[formcontrolname='ssn']"), function (index, control) {
                    $(this).focus();
                    $(this).blur();
                });
            }
        }
    }

    onPageNavigation(isNext) {
        if (isNext) {
            this.ssnInputsToFormat = $("input[formcontrolname='ssn']").length;
            this.isPrevious = false;
        }
        else {
            this.isPrevious = true;
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    setupBeneficiaryInfoFields() {
        let validator = this.model.willDefaultValidationApply ? Validation.ValidateRequiredWithNoEmptySpaceInput : Validators.nullValidator;
        this.model.country = this.model.country == "" ? this.defaultCountry : this.model.country;
        this.beneficiaryInfoForm = this.formBuilder.group({
            firstName: [this.model.firstName, validator],
            lastName: [this.model.lastName, validator],
            initials: [this.model.initials],
            relationship: [this.model.relationship, validator],
            benefit: [this.model.benefit, [validator, Validation.ValidateNumericWithNoAllZeroInput, Validators.pattern(Validation.threeDecimalDigitReg)]],
            address: [this.model.address, validator],
            city: [this.model.city, validator],
            country: [this.model.country, validator],
            state: [this.model.state, validator],
            zipCode: [this.model.zipCode, [Validators.pattern(Validation.zipCodeReg), validator, Validation.ValidateNumericWithNoAllZeroInput]],
            ssn: [this.model.ssn, [Validators.pattern(Validation.ssnReg), validator, Validation.ValidateNumericWithNoAllZeroInput]],
            dob: [this.model.dob, [Validators.pattern(Validation.dobReg), validator]],
            phone: [this.model.phone, [Validators.pattern(Validation.phoneNumberChkReg), Validation.ValidateNumericWithNoAllZeroInput]],
            emailAddress: [this.model.emailAddress, Validators.pattern(Validation.emailReg)],
            isIndividual: [this.model.isIndividual],
            trustName: [this.model.trustName],
            isInsured: [(this.model ? true : this.model.isInsured)],
        },
            {
                validator: (formGroup: FormGroup) => {
                    formGroup.controls.dob.valueChanges.subscribe(() => {
                        Validation.ValidateDob(formGroup.controls.dob);
                    });
                }
            });
    }

    ngOnInit() {

        this.setFormProperties();
        this.setupBeneficiaryInfoFields();
        this.getState(this.defaultCountry);

        this.beneficiaryInfoForm.controls["isInsured"].setValue("false");
        this.beneficiaryInfoForm.controls["isIndividual"].setValue("true");
        this.beneficiaryInfoForm.get("isIndividual").updateValueAndValidity();

        this.beneficiaryInfoForm.valueChanges.subscribe(form => {
            if (!this.viewOnly) {

                // Checking if any thing is actually changed. In IE, form valueChanges
                // function is automatically called even nothing is changed.
                let changedProperties = this.getChangedProperties();

                if (changedProperties != [] && changedProperties.length >= 1) {
                    if (!this.isChangeDueToValidChange && !this.model.willDefaultValidationApply) {
                        this.validatorSetup(this.isValidationRequired(this.beneficiaryInfoForm.value));
                    }
                    let controls = this.beneficiaryInfoForm.controls;
                    this.markControlsDirty([controls["state"], controls["firstName"], controls["lastName"],
                    controls["benefit"], controls["relationship"], controls["address"], controls["city"], controls["zipCode"], controls["dob"], controls["ssn"]]);

                    this.updateModelValue(form);
                    this.formValue.emit({ ComponentId: this.componentId, FormData: this.model });

                    let isValid = this.beneficiaryInfoForm.valid;
                    this.dataIsValid.emit({ ComponentId: this.componentId, FormIsValid: isValid });
                }
            }
        });
    }

    private getChangedProperties(): string[] {
        let changedProperties = [];
        Object.keys(this.beneficiaryInfoForm.controls).forEach((name) => {
            let currentControl = this.beneficiaryInfoForm.controls[name];

            if (currentControl.value != null
                && currentControl.value != ""
                && currentControl.value != "US"
                && currentControl.dirty) {
                changedProperties.push(name);
            }
        });
        return changedProperties;
    }

    //set form properties text from json file
    setFormProperties() {
        this.individualText = this.utility.getConfigText("cb_isIndividual_1");
        this.nonNaturalText = this.utility.getConfigText("cb_isIndividual_0");
        this.insuredOrAnnuitantText = this.utility.getConfigText("cb_isInsured_1");
        this.ownerText = this.utility.getConfigText("cb_isInsured_0");
    }

    onRemoved() {
        this.model = this.beneficiaryInfoForm.value;
        this.removeComponent.emit({ ComponentId: this.componentId, Model: this.model });
    }

    onEntityChanged(eventArgs: any) {
        let controls = this.beneficiaryInfoForm.controls;
        let individual = controls["isIndividual"];
        let firstName = controls["firstName"];
        let lastName = controls["lastName"];
        let trustName = controls["trustName"];
        let relationShip = controls["relationship"];
        let dob = controls["dob"];

        if (eventArgs.value == "false") {
            this.isIndividual = false;
            firstName.setValidators(null);
            firstName.setErrors(null);
            lastName.setValidators(null);
            lastName.setErrors(null);
            dob.setValidators(null);
            trustName.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput]);
            this.markControlsDirty([trustName]);
            this.ssnPlaceholder = "Tax Identification Number*";
        } else {
            this.isIndividual = true;
            firstName.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            lastName.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            dob.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.dobReg)]);
            trustName.setValidators(null);
            trustName.setErrors(null);
            this.ssnPlaceholder = "Social Security Number*";
        }
        relationShip.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
        Validation.ValidateForm(this.beneficiaryInfoForm);
    }

    onCountryChange(event) {
        let controls = this.beneficiaryInfoForm.controls;
        controls["state"].setValue(null);
        this.getState(event.value);
        this.zipMaxLength = Validation.ValidateZipCodeAsPerCountrySelected(controls["zipCode"], event.value);
        Validation.ValidatePhoneNumberAsPerCountrySelected(controls["phone"], event.value);

        this.markControlsDirty([controls["state"]]);
        Validation.ValidateForm(this.beneficiaryInfoForm);
    }

    public get Address() {
        let address: string = "";

        if (this.model.address)
            address = this.model.address;
        if (this.model.city)
            address = address + " " + this.model.city;
        if (this.model.state)
            address = address + " " + this.model.state;
        if (this.model.zipCode)
            address = address + " " + this.model.zipCode;
        if (this.model.country && this.countryModel.length > 0)
            address = address + " " + this.countryModel.filter(x => x.code == this.model.country)[0].name;//this.model.state;

        return address;
    }

    private getState(countryCode: string) {
        this.stateModel = this.countryModel.filter(x => x.code == countryCode)[0].states;
    }

    validatorSetup(isValidatorRequired: boolean) {
        let controls = this.beneficiaryInfoForm.controls;
        let firstName = controls["firstName"];
        let lastName = controls["lastName"];
        let relationship = controls["relationship"];
        let benefit = controls["benefit"];
        let address = controls["address"];
        let city = controls["city"];
        let country = controls["country"];
        let state = controls["state"];
        let zipCode = controls["zipCode"];
        let ssn = controls["ssn"];
        let dob = controls["dob"];
        let trustName = controls["trustName"];
        let isIndividual = controls["isIndividual"];

        if (this.isChangeDueToValidChange)
            return;

        if (!isValidatorRequired) {
            firstName.setValidators(null);
            firstName.setErrors(null);

            lastName.setValidators(null);
            lastName.setErrors(null);

            relationship.setValidators(null);
            relationship.setErrors(null);

            benefit.setValidators(null);
            benefit.setErrors(null);

            address.setValidators(null);
            address.setErrors(null);

            city.setValidators(null);
            city.setErrors(null);

            country.setValidators(null);
            country.setErrors(null);

            state.setValidators(null);
            state.setErrors(null);

            zipCode.setValidators(null);
            zipCode.setErrors(null);

            ssn.setValidators(null);
            ssn.setErrors(null);

            dob.setValidators(null);
            dob.setErrors(null);

            trustName.setValidators(null);
            trustName.setErrors(null);
        }
        else {
            if (isIndividual.value == "true") {
                firstName.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
                lastName.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
                trustName.setValidators(null);
                trustName.setErrors(null);
                dob.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.dobReg)]);

            }
            else {
                trustName.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
                firstName.setValidators(null);
                firstName.setErrors(null);
                lastName.setValidators(null);
                lastName.setErrors(null);
                dob.setValidators(null);

            }
            relationship.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            benefit.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.pattern(Validation.threeDecimalDigitReg)]);
            address.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            city.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            country.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            state.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            zipCode.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.zipCodeReg), Validation.ValidateNumericWithNoAllZeroInput]);
            ssn.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.ssnReg), Validation.ValidateNumericWithNoAllZeroInput]);
        }

        this.isChangeDueToValidChange = true;
        Validation.ValidateForm(this.beneficiaryInfoForm);
        this.isChangeDueToValidChange = false;
    }

    isValidationRequired(form: any): boolean {
        if (this.model.willDefaultValidationApply ||
            (form.address != "" || form.benefit != 0 || form.city != "" || form.country != "US" || form.dob != null || form.emailAddress != ""
                || form.firstName != "" || form.initials != "" || form.isIndividual != true || form.lastName != ""
                || form.phone != "" || form.relationship != "" || form.ssn != "" || form.state != "" || form.trustName != "" || form.zipCode != "")) {
            return true;
        }
        else {
            return false;
        }
    }

    updateModelValue(formModel: any) {
        this.model.firstName = formModel.firstName;
        this.model.initials = formModel.initials;
        this.model.lastName = formModel.lastName;
        this.model.benefit = formModel.benefit;
        this.model.isInsured = formModel.isInsured;
        this.model.relationship = formModel.relationship;
        this.model.address = formModel.address;
        this.model.city = formModel.city;
        this.model.country = formModel.country;
        this.model.state = formModel.state;
        this.model.zipCode = formModel.zipCode;
        this.model.ssn = formModel.ssn;
        this.model.dob = formModel.dob;
        this.model.phone = formModel.phone;
        this.model.emailAddress = formModel.emailAddress;
        this.model.isIndividual = formModel.isIndividual == "true";
        this.model.trustName = formModel.trustName;
    }

    public canBeneficiaryDisplayInViewMode(): boolean {
        return this.isValidationRequired(this.model);
    }

    markControlsDirty(controlList: any) {
        controlList.forEach(control => {
            control.markAsTouched();
        });
    }

    get fullName(): string {
        return this.model.firstName + ' ' + this.model.initials + ' ' + this.model.lastName;
    }

    get relationshipTo(): string {
        return this.beneficiaryInfoForm.controls["isInsured"].value == 'true' ? 'Insured' : 'Owner'
    }

    private ChkValidationOnBlur(element: any) {
        let controls = this.beneficiaryInfoForm.controls;
        this.utility.ChkValidateNumberWithDecimalAndLeadingZeroOnBlur(element, this.model.benefit, controls["benefit"], this.beneficiaryInfoForm);
    }

    private ChkValidationOnFocus() {
        let controls = this.beneficiaryInfoForm.controls;
        this.utility.ChkValidationsOnFocus(controls["benefit"], this.beneficiaryInfoForm, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.pattern(Validation.threeDecimalDigitReg)]);
    }

}
