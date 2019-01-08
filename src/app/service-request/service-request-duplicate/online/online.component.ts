import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppConfig } from "app/configuration/app.config";
import { DuplicateServiceRequestModel } from "app/models/duplicateServiceRequest.model";
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'duplicate-service-request-online',
    styles: [],
    templateUrl: './online.component.html'
})

export class DuplicateServiceRequestOnlineComponent implements OnInit {

    public isViewOnly: boolean = false;
    public isRequestSubmitted: boolean = false;
    public isAgreedToTerms: boolean = false;
    public isPolicyLost: boolean = false;
    public isIndividual: boolean = true;
    public isInsured: boolean = true;
    public changeType: string = "";
    public dateFormat: string;

    model: DuplicateServiceRequestModel = null;
    duplicatRequestForm: FormGroup = null;

    constructor(
        private formBuilder: FormBuilder,
        public config: AppConfig,
        private location: Location) {
        this.dateFormat = this.config.getConfig("date_format");
        this.model = this.model == null ? new DuplicateServiceRequestModel("", "", "", "", "", "", "", "") : this.model;
    }

    ngOnInit() {
        this.setupFormFileds();
    }
  
    setupFormFileds() {
        this.duplicatRequestForm = this.formBuilder.group({
            assignedName: [this.model.assignedName, Validation.ValidateRequiredWithNoEmptySpaceInput],
            assignmentDate: [this.model.assignmentDate, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.dobReg)]],
            address: [this.model.address, Validation.ValidateRequiredWithNoEmptySpaceInput],
            city: [this.model.city, Validation.ValidateRequiredWithNoEmptySpaceInput],
            state: [this.model.state, Validation.ValidateRequiredWithNoEmptySpaceInput],
            zipCode: [this.model.zipCode, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.zipCodeReg), Validation.ValidateNumericWithNoAllZeroInput]]
        });
    }

    next() {
        this.model.insuredName = "Bob Smith";
        this.model.policyNumber = "L7890123";
        this.model.assignedName = this.duplicatRequestForm.controls.assignedName.value;
        this.model.assignmentDate = this.duplicatRequestForm.controls.assignmentDate.value;
        this.isViewOnly = true;
    }

    cancelRequest() {
        this.location.back();
    }

    previous() {
        this.isViewOnly = false;
    }

    submitRequest() {
        this.isRequestSubmitted = true;
    }

    readTermsAndConditions(event) {
        if (event.checked)
            this.isAgreedToTerms = true;
        else
            this.isAgreedToTerms = false;
    }

    confirmedPolicyHasLost(event) {
        if (event.checked)
            this.isPolicyLost = true;
        else
            this.isPolicyLost = false;
    }
}