import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppConfig } from "app/configuration/app.config";
import { ServiceRequestType } from "app/enums/service-type.enum";
import { ServiceRequestTermLifeInsuranceCancellationModel } from 'app/models/serviceRequestTermLifeInsuranceCancellation.model';
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'term-life-insurance-cancellation',
    styles: [],
    templateUrl: './online.component.html'
})

export class TermLifeInsuranceCancellationOnlineComponent implements OnInit {

    @Input('isviewonly') isViewOnly: boolean = false;

    public isRequestSubmitted: boolean = false;
    public isAgreedToTerms: boolean = false;
    public isIndividual: boolean = true;

    public changeType: string = "";

    public model: ServiceRequestTermLifeInsuranceCancellationModel = null;
    public TLICForm: FormGroup = null;
    public userComment: string = "";
    public isPageValid: boolean = true;
    public dateFormat: string;
    @Output('onvaluechanged')
    formValue = new EventEmitter();
    public isEffectiveDateReadonly: boolean = true;

    constructor(private formBuilder: FormBuilder, public config: AppConfig) {
        this.dateFormat = this.config.getConfig("date_format");
        this.model = this.model == null ? new ServiceRequestTermLifeInsuranceCancellationModel() : this.model;
    }

    ngOnInit() {
        this.setupFormFileds();

        //Raising invalid form state event.
        this.formValue.emit({ FormData: this.model });
        this.TLICForm.valueChanges.subscribe(form => {
            if (!this.isViewOnly) {
                this.isPageValid = this.TLICForm.valid;
                this.model = form;
                this.emitResult();
            }
        });
        this.TLICForm.get('isCancellationImmediate').valueChanges.subscribe((isCancellationImmediate: string) => {
            if (!this.isViewOnly) {
                if (isCancellationImmediate == "false") {
                    this.isEffectiveDateReadonly = false;
                    this.TLICForm.get('effectiveDate').setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.dobReg)]);
                }
                else {
                    this.TLICForm.get('effectiveDate').clearValidators();
                    this.TLICForm.get('effectiveDate').setValue("");
                    this.isEffectiveDateReadonly = true;
                }
                this.TLICForm.get('effectiveDate').updateValueAndValidity();
            }
        });
    }

    setupFormFileds() {
        this.TLICForm = this.formBuilder.group({

            isCancellationImmediate: [(this.model ? true : this.model.isCancellationImmediate)],
            effectiveDate: [this.model.effectiveDate],
        },{
            validator: (formGroup: FormGroup) => {
                formGroup.controls.effectiveDate.valueChanges.subscribe(() => {
                    if(formGroup.controls.isCancellationImmediate.value=="false")
                    Validation.ValidateDateGreaterThanCurrentAndWithinNumDays(formGroup.controls.effectiveDate, 60);
                });
            }
        });
    }

  
    emitResult(comment: any = "") {
        let result = {
            RequestType: ServiceRequestType.TermLifeInsuranceCancellation,
            TLICData: this.model,
            IsDataValid: this.pageIsValid,
            UserComment: comment == "" ? this.userComment : comment
        };
        this.formValue.emit(result);
    }

    get pageIsValid(): boolean {
        return this.isPageValid;
    }
}