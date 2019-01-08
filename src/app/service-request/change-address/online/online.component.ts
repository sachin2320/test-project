import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServiceRequestChangeAddressModel } from 'app/models/serviceRequestChangeAddress.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from 'app/configuration/app.config';
import { Validation } from 'app/shared-services/validation.service';
import { ServiceRequestType } from 'app/enums/service-type.enum';
import { StateModel } from 'app/models/state.model';
import { CountryModel } from 'app/models/country.model';
import { SpinnerService } from 'app/shared-services/spinner.service';
import { SnackbarService } from 'app/shared-services/snackbar.service';
import { CommonService } from 'app/shared-services/common.service';
import { UtilityService } from 'app/services/helper/utility.service';

@Component({
    selector: 'change-address',
    styles: [],
    templateUrl: './online.component.html'
})

export class ChangeAddressOnlineComponent implements OnInit {
    defaultCountry: string = "";
    stateModel: StateModel[] = [];
    countryModel: CountryModel[] = [];
    @Input('isviewonly') isViewOnly: boolean = false;

    public model: ServiceRequestChangeAddressModel = null;
    public addressChangeForm: FormGroup = null;
    public userComment: string = "";
    public isPageValid: boolean = false;
    public zipMaxLength: number = 10; // 5;

    public changeNameForInsuredOrAnnuitantText: string = "";
    public changeNameForOwnerText: string = "";

    @Output('onvaluechanged')
    formValue = new EventEmitter();

    constructor(private formBuilder: FormBuilder,
        public config: AppConfig,
        private spinner: SpinnerService,
        private commonService: CommonService,
        private notification: SnackbarService,
        private utility: UtilityService) {
        this.model = this.model == null ? new ServiceRequestChangeAddressModel() : this.model;
        this.defaultCountry = this.config.getConfig("default_country");
    }

    ngOnInit() {
        this.changeNameForInsuredOrAnnuitantText = this.utility.getConfigText("insuredOrAnnuitant");
        this.changeNameForOwnerText = this.utility.getConfigText("owner");

        this.getCountry();
        this.setupFormFields();

        //Raising invalid form state event.
        this.formValue.emit({ FormData: this.model });
        this.addressChangeForm.valueChanges.subscribe(form => {
            if (!this.isViewOnly) {
                this.isPageValid = this.addressChangeForm.valid;
                this.model = form;
                this.emitResult();
            }
        });
        this.addressChangeForm.controls["isInsured"].setValue("false");
    }

    setupFormFields() {
        this.addressChangeForm = this.formBuilder.group({
            firstName: [this.model.firstName, Validation.ValidateRequiredWithNoEmptySpaceInput],
            lastName: [this.model.lastName, Validation.ValidateRequiredWithNoEmptySpaceInput],
            middleInitials: [this.model.middleInitials],
            street: [this.model.street, Validation.ValidateRequiredWithNoEmptySpaceInput],
            city: [this.model.city, Validation.ValidateRequiredWithNoEmptySpaceInput],
            state: [this.model.state, Validation.ValidateRequiredWithNoEmptySpaceInput],
            zip: [this.model.zip, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.zipCodeReg),
            Validation.ValidateNumericWithNoAllZeroInput]],
            phone: [this.model.phone, [Validators.pattern(Validation.phoneNumberChkReg), Validation.ValidateNumericWithNoAllZeroInput]],
            emailAddress: [this.model.emailAddress, Validators.pattern(Validation.emailReg)],
            isInsured: [(this.model ? true : this.model.isInsured)],
            country: [this.model.country == "" ? this.defaultCountry : this.model.country]
        });
    }
    private getState(countryCode: string) {
        this.stateModel = this.countryModel.filter(x => x.code == countryCode)[0].states;

    }
    onCountryChange(event) {
        let controls = this.addressChangeForm.controls;
        controls["state"].setValue(null);
        this.getState(event.value);
        this.zipMaxLength = Validation.ValidateZipCodeAsPerCountrySelected(controls["zip"], event.value);

        Validation.ValidatePhoneNumberAsPerCountrySelected(controls["phone"], event.value);
        Validation.ValidateForm(this.addressChangeForm);
    }

    private getCountry() {
        this.spinner.start();
        this.commonService.getCountries().subscribe(results => {
            this.spinner.stop();
            this.countryModel = results;
            this.getState(this.defaultCountry);
            this.spinner.stop();
        }, error => {
            this.spinner.stop();
            this.notification.popupSnackbar(error);
        });
    }

    emitResult(comment: any = "") {
        let result = {
            RequestType: ServiceRequestType.ChangeMailingAddress,
            ChangeNameData: this.model,
            IsDataValid: this.pageIsValid,
            UserComment: comment
        };
        this.formValue.emit(result);
    }

    get pageIsValid(): boolean {
        return this.isPageValid;
    }

    get getFullName(): string {
        return this.model.firstName + ' ' + this.model.middleInitials + ' ' + this.model.lastName;
    }

    get getAddress(): string {
        return this.model.street + ', ' 
        + this.model.city + ', ' 
        + this.model.state + ' ' 
        + this.model.zip + ' ' 
        + this.model.country;
    }
}