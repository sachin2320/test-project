
import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from "app/configuration/app.config";
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'user-personalinfo',
    styles: [],
    templateUrl: './personalInfo.component.html'
})

export class PersonalInfoComponent implements OnInit {
    @Input('personalinfoform') personalInfoForm: any = {};
    @Input('isPolicyVerifying') isPolicyVerifying: boolean = false;
    @Input('personalInfoErrorMessage') personalInfoErrorMessage: string = "";

    public isIndividual: boolean = true;
    public ssnPlaceHolder: string = "Social security number";
    public dayTimePhone: string = "";

    constructor(public config: AppConfig) { }

    ngOnInit(): void {
    }

    onRadioStateChange(eventArgs: any) {
        let controls = this.personalInfoForm.controls;
        let ownerFirstName = controls["ownerFirstName"];
        let ownerLastName = controls["ownerLastName"];
        let trustName = controls["trustName"];
        this.isIndividual = Boolean(JSON.parse(eventArgs.value));
        this.ssnPlaceHolder = this.isIndividual ? "Social security number" : "Tax Identification number";

        controls["individual"].setValue(this.isIndividual);
        ownerFirstName.setValidators(this.isIndividual ? Validation.ValidateRequiredWithNoEmptySpaceInput : null);
        ownerLastName.setValidators(this.isIndividual ? Validation.ValidateRequiredWithNoEmptySpaceInput : null);
        trustName.setValidators(this.isIndividual ? null : Validation.ValidateRequiredWithNoEmptySpaceInput);
        Validation.ValidateForm(this.personalInfoForm);
    }

    formatPhoneNumber() {
        let value = this.personalInfoForm.controls["dayTimePhone"].value.replace(/\D/g, '');;
        if (value.length === 10) {
            this.dayTimePhone =
                value.substring(0, 3) + '-' +
                value.substring(3, 6) + '-' +
                value.substring(6, 10);
            this.personalInfoForm.controls["dayTimePhone"].value = this.dayTimePhone;
        }
    }
}