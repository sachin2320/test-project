import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from "app/configuration/app.config";
import { AccountTypes, IsPayorDifferentThanPolicyOwner, PaymentModes, PremiumTypes } from 'app/enums/service-request-change-payment-mode.enum';
import { ServiceRequestType } from "app/enums/service-type.enum";
import { NavigationStateChangeModel } from 'app/models/navigationStateChange.model';
import { ServiceRequestUpdatePaymentModeModel } from 'app/models/serviceRequestUpdatePaymentMode.model';
import { UtilityService } from 'app/services/helper/utility.service';
import { DataService } from 'app/shared-services/data.service';
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'update-payment-mode',
    styles: [],
    templateUrl: 'online.component.html'
})

export class ServiceRequestChangePaymentModeOnlineComponent implements OnInit {

    @Input('isviewonly') isViewOnly: boolean = false;
    @Input('policynumber') policyNumber: string = "";
    @Input('ownername') ownerName: string = "";
    @Input('servicetype') serviceType: ServiceRequestType = ServiceRequestType.None;

    @Output('onvaluechanged')
    formValue = new EventEmitter();

    @Output('onNavigationStateChange')
    navigationStateChanged = new EventEmitter();

    public model: ServiceRequestUpdatePaymentModeModel = null;
    public updatePaymentModeForm: FormGroup = null;
    public userComment: string = "";
    public isPageValid: boolean = true;
    public dateFormat: string;
    public controlDisabled: boolean = true;
    public isParentNavigationHide: boolean = true;

    public PremiumTypes = PremiumTypes;
    public IsPayorDifferentThanPolicyOwner = IsPayorDifferentThanPolicyOwner;
    public annualPaymentModeText: string = "";
    public semiannualPaymentModeText: string = "";
    public quarterlyPaymentModeText: string = "";
    public monthlyPaymentModeText: string = "";

    public changePlannedPremiumText: string = "";
    public changePremiumModeOtherThanMonthlyText: string = "";
    public changePremiumModeMonthlyText: string = "";

    public isPayorDifferentYesText: string = "";
    public isPayorDifferentNoText: string = "";

    public checkingAccountText: string = "";
    public savingAccountText: string = "";

    public formattedPlannedPremium: string = "";

    constructor(
        private route: ActivatedRoute,
        private dataService: DataService,
        private router: Router,
        private formBuilder: FormBuilder,
        public config: AppConfig,
        private utility: UtilityService,
        private currencyPipe: CurrencyPipe) {
        this.dateFormat = this.config.getConfig("date_format");

        this.model = this.model == null ? new ServiceRequestUpdatePaymentModeModel() : this.model;
    }

    ngOnInit() {
        this.setRadioButtonsText();

        //populate model if request come back from offline page previous' click
        if (this.dataService.serviceRequestNavigationData != null && this.dataService.serviceRequestNavigationData.pageModel != null) {
            this.model = this.dataService.serviceRequestNavigationData.pageModel;
            this.dataService.serviceRequestNavigationData = null;
        }

        this.setupFormFields();
        this.validateControls();
        this.dataService.serviceRequestNavigationStateChanged.subscribe(x => {
            this.isParentNavigationHide = x.hideParentNavigation;
        })

        //Raising invalid form state event.
        this.navigationStateChanged.emit(new NavigationStateChangeModel(null, this.isParentNavigationHide, true));
        this.formValue.emit({ FormData: this.model });

        this.updatePaymentModeForm.valueChanges.subscribe(form => {
            if (!this.isViewOnly) {
                this.isPageValid = this.updatePaymentModeForm.valid;
                this.model = form;
                this.emitResult();
            }
        });
    }

    private setRadioButtonsText() {
        this.annualPaymentModeText = this.utility.getConfigText("upm_paymentMode_" + PaymentModes.Annual);
        this.semiannualPaymentModeText = this.utility.getConfigText("upm_paymentMode_" + PaymentModes.Semiannual);
        this.quarterlyPaymentModeText = this.utility.getConfigText("upm_paymentMode_" + PaymentModes.Quarterly);
        this.monthlyPaymentModeText = this.utility.getConfigText("upm_paymentMode_" + PaymentModes.Monthly);

        this.changePlannedPremiumText = this.utility.getConfigText("upm_premiumType_" + PremiumTypes.ChangePlannedPremium);
        this.changePremiumModeOtherThanMonthlyText = this.utility.getConfigText("upm_premiumType_" + PremiumTypes.ChangePremiumModeOtherThanMonthly);
        this.changePremiumModeMonthlyText = this.utility.getConfigText("upm_premiumType_" + PremiumTypes.ChangePremiumModeMonthly);

        this.isPayorDifferentYesText = this.utility.getConfigText("upm_isPayorDifferent_" + IsPayorDifferentThanPolicyOwner.Yes);
        this.isPayorDifferentNoText = this.utility.getConfigText("upm_isPayorDifferent_" + IsPayorDifferentThanPolicyOwner.No);

        this.checkingAccountText = this.utility.getConfigText("upm_accountType_" + AccountTypes.Checking);
        this.savingAccountText = this.utility.getConfigText("upm_accountType_" + AccountTypes.Savings);
    }

    next() {
        if (this.updatePaymentModeForm.get('isPayorDifferentThanPolicyOwner').value == "true") {
            let url: string = this.config.getConfig('appServiceRequestOfflineUrl') + "/" + this.policyNumber + "/" + this.serviceType;
            this.dataService.serviceRequestNavigationData =
                new NavigationStateChangeModel(this.model, this.isParentNavigationHide, true, this.router.url, true);
            this.router.navigate([url]);
        }
        else {
            this.isParentNavigationHide = false;
            this.navigationStateChanged.emit(new NavigationStateChangeModel(this.model, this.isParentNavigationHide, true));
        }
    }

    setupFormFields() {
        this.updatePaymentModeForm = this.formBuilder.group({
            paymentMode: [this.model.paymentMode],
            premiumPlanned: [this.model.premiumPlanned, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.pattern(Validation.decimalReg)]],
            premiumType: [this.model.premiumType, Validators.required],
            isPayorDifferentThanPolicyOwner: [this.model.isPayorDifferentThanPolicyOwner],
            isBankingInformationChanged: [this.model.isBankingInformationChanged],
            financialInstitutionName: [this.model.financialInstitutionName],
            payorFirstName: [this.model.payorFirstName],
            payorLastName: [this.model.payorLastName],
            payorMiddleInitials: [this.model.payorMiddleInitials],
            accountType: [this.model.accountType],
            routingNumber: [this.model.routingNumber],
            accountNumber: [this.model.accountNumber],
            confirmRoutingNumber: [this.model.confirmRoutingNumber],
            confirmAccountNumber: [this.model.confirmAccountNumber]
        }, {
                validator: (group: FormGroup) => {
                    let premiumType = group.controls["premiumType"].value;
                    let isPayorDifferentThanPolicyOwner = this.model.isPayorDifferentThanPolicyOwner;

                    if (premiumType == "3" && isPayorDifferentThanPolicyOwner) {
                        group.controls.routingNumber.valueChanges.subscribe(() => {
                            Validation.MatchControlValues(group.controls.routingNumber, group.controls.confirmRoutingNumber, false);
                        });
                        group.controls.confirmRoutingNumber.valueChanges.subscribe(() => {
                            Validation.MatchControlValues(group.controls.routingNumber, group.controls.confirmRoutingNumber, false);
                        });
                        group.controls.accountNumber.valueChanges.subscribe(() => {
                            Validation.MatchControlValues(group.controls.accountNumber, group.controls.confirmAccountNumber, false);
                        });
                        group.controls.confirmAccountNumber.valueChanges.subscribe(() => {
                            Validation.MatchControlValues(group.controls.accountNumber, group.controls.confirmAccountNumber, false);
                        });
                    }
                }
            });
    }

    onPremiumTypeChanged(event: any) {
        this.utility.resetFormGroup(this.updatePaymentModeForm);
        this.updatePaymentModeForm.get('premiumType').setValue(event.value);
        this.formattedPlannedPremium = null;
        this.validateControls();

        if (event.value != "3") {
            this.updatePaymentModeForm.get('accountType').setValue(null);
            this.updatePaymentModeForm.get('paymentMode').setValue(null);
        }
        else {
            this.updatePaymentModeForm.get('accountType').setValue(null);   // ALM-367 (ALM-215)
        }
    }

    onPayorDifferentChanged(event: any) {
        this.utility.resetFormGroup(this.updatePaymentModeForm);
        this.validateControls();

        this.updatePaymentModeForm.get('premiumType').setValue(PremiumTypes.ChangePremiumModeMonthly);
        if (event.value == 'false') {
            this.updatePaymentModeForm.get('confirmRoutingNumber').setValue('');
            this.updatePaymentModeForm.get('confirmAccountNumber').setValue('');
            // this.updatePaymentModeForm.get('accountType').setValue("1");     // ALM-367 (ALM-215)
            this.updatePaymentModeForm.get('paymentMode').setValue("4");
            this.updatePaymentModeForm.get('isPayorDifferentThanPolicyOwner').setValue(event.value)
        }
    }

    cancelRequest() {
        this.utility.navigateOnCancelServiceRequest();
    }

    validateControls() {
        let controls = this.updatePaymentModeForm.controls;
        let accountType = controls["accountType"];              // ALM-367 (ALM-215)
        let premiumType = controls["premiumType"].value;
        let paymentMode = controls["paymentMode"];
        let financialInstitutionName = controls["financialInstitutionName"];
        let payorFirstName = controls["payorFirstName"];
        let payorLastName = controls["payorLastName"];
        let routingNumber = controls["routingNumber"];
        let accountNumber = controls["accountNumber"];
        let confirmRoutingNumber = controls["confirmRoutingNumber"];
        let confirmAccountNumber = controls["confirmAccountNumber"];
        let isPayorDifferentThanPolicyOwner = this.model.isPayorDifferentThanPolicyOwner;

        if (premiumType == PremiumTypes.ChangePlannedPremium) {
            accountType.setValidators(null);                    // ALM-367 (ALM-215)
            paymentMode.setValidators(null);
            financialInstitutionName.setValidators(null);
            payorFirstName.setValidators(null);
            payorLastName.setValidators(null);
            routingNumber.setValidators(null);
            accountNumber.setValidators(null);
            confirmRoutingNumber.setValidators(null);
            confirmAccountNumber.setValidators(null);
            confirmRoutingNumber.setErrors(null);
            confirmAccountNumber.setErrors(null);

            controls["isPayorDifferentThanPolicyOwner"].setValue('');
        }
        else if (premiumType == PremiumTypes.ChangePremiumModeOtherThanMonthly) {
            accountType.setValidators(null);                    // ALM-367 (ALM-215)
            paymentMode.setValidators(Validators.required);
            financialInstitutionName.setValidators(null);
            payorFirstName.setValidators(null);
            payorLastName.setValidators(null);
            routingNumber.setValidators(null);
            accountNumber.setValidators(null);
            confirmRoutingNumber.setValidators(null);
            confirmAccountNumber.setValidators(null);
            confirmRoutingNumber.setErrors(null);
            confirmAccountNumber.setErrors(null);
            controls["isPayorDifferentThanPolicyOwner"].setValue("");
        }
        else if (premiumType == PremiumTypes.ChangePremiumModeMonthly) {
            paymentMode.setValidators(Validators.required);
            accountType.setValidators(Validators.required);     // ALM-367 (ALM-215)
            financialInstitutionName.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.minLength(2)]);
            payorFirstName.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            payorLastName.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            routingNumber.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.minLength(9)]);
            accountNumber.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.minLength(6)]);
            confirmRoutingNumber.setValidators(null);
            confirmAccountNumber.setValidators(null);
            confirmRoutingNumber.setErrors(null);
            confirmAccountNumber.setErrors(null);
        }

        Validation.ValidateForm(this.updatePaymentModeForm);
    }

    emitResult(comment: any = "") {
        let result = {
            RequestType: ServiceRequestType.ChangePaymentMode,
            UpdatePaymentModeData: this.model,
            IsDataValid: this.pageIsValid,
            UserComment: comment == "" ? this.userComment : comment
        };
        this.formValue.emit(result);
    }

    get pageIsValid(): boolean {
        return this.isPageValid;
    }

    get getFullName(): string {
        let fullName: string = "";

        if (this.model.payorMiddleInitials) {
            fullName = this.model.payorFirstName + " " + this.model.payorMiddleInitials + " " + this.model.payorLastName;
        }
        else {
            fullName = this.model.payorFirstName + " " + this.model.payorLastName;
        }
        return fullName;
    }

    get getAccountType(): string {
        let accountType: string = "";

        if (this.model.accountType == AccountTypes.Checking) {
            accountType = this.checkingAccountText + " " + "account";
        }
        else if (this.model.accountType == AccountTypes.Savings) {
            accountType = this.savingAccountText + " " + "account";
        }
        return accountType;
    }

    get getPremiumMode(): string {
        let premiumMode: string = "";

        if (this.model.paymentMode == PaymentModes.Annual) {
            premiumMode = this.annualPaymentModeText;
        }
        else if (this.model.paymentMode == PaymentModes.Semiannual) {
            premiumMode = this.semiannualPaymentModeText;
        }
        else if (this.model.paymentMode == PaymentModes.Quarterly) {
            premiumMode = this.quarterlyPaymentModeText;
        }
        else
            premiumMode = this.monthlyPaymentModeText;

        return premiumMode;
    }

    // Format currency values
    private transformAmount(element: any) {
        this.formattedPlannedPremium = this.currencyPipe.transform(this.model.premiumPlanned, null, '', '1.2-2');
        element.target.value = this.formattedPlannedPremium;
        element.target.maxLength = 17;
    }

    // Format currency values
    private normalizeAmount(element: any) {
        this.formattedPlannedPremium = this.model.premiumPlanned;
        element.target.value = this.formattedPlannedPremium;
        element.target.maxLength = 11;
    }
}