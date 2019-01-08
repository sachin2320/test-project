import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from 'app/configuration/app.config';
import { Validation } from 'app/shared-services/validation.service';
import { ServiceRequestType } from 'app/enums/service-type.enum';
import { ServiceRequestAutomaticPremiumBankInformationModel } from 'app/models/serviceRequestAutomaticPremiumBankInformation.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'app/shared-services/data.service';
import { NavigationStateChangeModel } from 'app/models/navigationStateChange.model';
import { UtilityService } from 'app/services/helper/utility.service';

@Component({
    selector: 'automatic-premium-bank-information',
    styles: [],
    templateUrl: './online.component.html'
})

export class ServiceRequestAutomaticPremiumBankInformationOnlineComponent implements OnInit {
    @Input('isviewonly') isViewOnly: boolean = false;
    @Input('policynumber') policyNumber: string = "";
    @Input('ownername') ownerName: string = "";
    @Input('servicetype') serviceType: ServiceRequestType = ServiceRequestType.None;

    @Output('onvaluechanged') formValue = new EventEmitter();
    @Output('onNavigationStateChange')navigationStateChanged = new EventEmitter();

    public model: ServiceRequestAutomaticPremiumBankInformationModel = null;
    public automaticPremiumBankInformationForm: FormGroup = null;
    public userComment: string = '';
    public isPageValid: boolean = false;
    public isParentNavigationHide: boolean = true;

    constructor(
        private route: ActivatedRoute, 
        private dataService: DataService,
        private router: Router, 
        private formBuilder: FormBuilder, 
        public config: AppConfig,
        private utility: UtilityService) {
        this.model = this.model == null ? new ServiceRequestAutomaticPremiumBankInformationModel() : this.model;
    }

    ngOnInit() {
        //populate model if request come back from offline page after click of previous button.
        if (this.dataService.serviceRequestNavigationData != null && this.dataService.serviceRequestNavigationData.pageModel != null) {
            this.model = this.dataService.serviceRequestNavigationData.pageModel;
            this.dataService.serviceRequestNavigationData = null;
        }

        this.setupFormFields();

        this.dataService.serviceRequestNavigationStateChanged.subscribe(x => {
            this.isParentNavigationHide = x.hideParentNavigation;
        })

        //Raising invalid form state event so that parent page make navigation button in disable state.
        this.formValue.emit({ FormData: this.model });

        //Notifying parent page to display hide default navigation bar.
        this.navigationStateChanged.emit(new NavigationStateChangeModel(null, this.isParentNavigationHide, true));

        this.automaticPremiumBankInformationForm.valueChanges.subscribe(form => {
            if (!this.isViewOnly) {
                this.isPageValid = this.automaticPremiumBankInformationForm.valid;
                this.model = form;
                this.emitResult();
            }
        });

        this.automaticPremiumBankInformationForm.controls["isAccountTypeCheckings"].setValue(null);    // ALM-367 (ALM-215) Do not initialize radio buttons
        // this.automaticPremiumBankInformationForm.controls["isAccountTypeCheckings"].setValue("true");    // ALM-367 (ALM-215) Do not initialize radio buttons
    }

    private setupFormFields() {
        this.automaticPremiumBankInformationForm = this.formBuilder.group({
            isPayorDifferent: [this.model.isPayorDifferent, Validators.required],
            financialInstitutionName: [this.model.financialInstitutionName, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.minLength(2)]],
            payorFirstName: [this.model.payorFirstName, Validation.ValidateRequiredWithNoEmptySpaceInput],
            payorLastName: [this.model.payorLastName, Validation.ValidateRequiredWithNoEmptySpaceInput],
            payorMiddleInitials: [this.model.payorMiddleInitials],
            isAccountTypeCheckings: [Validators.required],    // ALM-367 (ALM-215)
            // isAccountTypeCheckings: [(this.model ? true : this.model.isAccountTypeCheckings), Validators.required],  // ALM-367 (ALM-215)
            routingNumber: [this.model.routingNumber, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.minLength(9)]],
            accountNumber: [this.model.accountNumber, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validation.ValidateNumericWithNoAllZeroInput, Validators.minLength(6)]],
            confirmRoutingNumber: [this.model.confirmRoutingNumber, [Validators.minLength(9)]],
            confirmAccountNumber: [this.model.confirmAccountNumber, [Validators.minLength(6)]]
        }, {
                validator: (group: FormGroup) => {
                    group.controls.routingNumber.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.routingNumber,group.controls.confirmRoutingNumber,false);
                    });
                    group.controls.confirmRoutingNumber.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.routingNumber,group.controls.confirmRoutingNumber,false);
                    });
                    group.controls.accountNumber.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.accountNumber,group.controls.confirmAccountNumber,false);
                    });
                    group.controls.confirmAccountNumber.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.accountNumber,group.controls.confirmAccountNumber,false);
                    });
                }
            });
    }

    private emitResult(comment: any = '') {
        let result = {
            RequestType: ServiceRequestType.ChangeAutomationPremiumBankInformation,
            AutomationPremiumBankInformationData: this.model,
            IsDataValid: this.pageIsValid,
            UserComment: comment == '' ? this.userComment : comment
        };
        this.formValue.emit(result);
    }

    private get pageIsValid(): boolean {
        return this.isPageValid;
    }

    private next() {
        if (this.automaticPremiumBankInformationForm.get('isPayorDifferent').value == 'true') {
            let url: string = this.config.getConfig('appServiceRequestOfflineUrl') + '/' + this.policyNumber + '/' + this.serviceType;
            this.dataService.serviceRequestNavigationData = 
                new NavigationStateChangeModel(this.model, this.isParentNavigationHide, true, this.router.url, true);
            this.router.navigate([url]);
        }
        else {
            this.isParentNavigationHide = false;
            this.navigationStateChanged.emit(new NavigationStateChangeModel(this.model, this.isParentNavigationHide, true));
        }
    }

    private cancelRequest() {
        this.utility.navigateOnCancelServiceRequest();
    }
}