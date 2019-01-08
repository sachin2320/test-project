import { OnInit, Component, Input, EventEmitter, Output } from "@angular/core";
import { ServiceRequestHeaderModel } from "app/models/serviceRequestHeader.model";
import { Validation } from "app/shared-services/validation.service";
import { AppConfig } from "app/configuration/app.config";
import { ServiceRequestType } from "app/enums/service-type.enum";
import { NumberMaskingPipe } from "app/shared/number.masking.pipe";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: 'servicerequest-header',
    styles: [],
    templateUrl: './service-request-header.component.html'
})

export class ServiceRequestHeadComponent implements OnInit {
    @Input('model') headerModel: ServiceRequestHeaderModel = null;
    @Input('isviewonly') isViewOnly: boolean = false;
    @Input('disclosuretext') disclosureText: string = "Disclosure / Terms / Conditions / Electronic Signature";
    @Input('isprintonly') isPrintOnly: boolean = false;
    @Input('issrdetailonly') isSrDetailOnly: boolean = false;
    @Input('servicetype') serviceType: ServiceRequestType = ServiceRequestType.None;

    @Output('onheadervaluechnaged')
    headerValueChanged = new EventEmitter();

    public isSsnValid: boolean = false;
    public headerFormGroup: FormGroup = null;

    constructor(private formBuilder: FormBuilder, public config: AppConfig, private numberMaskingPipe: NumberMaskingPipe) {
        if (this.headerModel == null)
            this.headerModel = new ServiceRequestHeaderModel(); 
    }

    emitValueChange() {
        this.isSsnValid = this.headerModel.showSsn ? this.headerFormGroup.valid : true;
        this.headerValueChanged.emit({ IsHeaderDataValid: this.isSsnValid, Ssn: this.headerFormGroup.controls.ssn.value });
    }

    ngOnInit() {
        this.setupFormFields();
    }

    setupFormFields() {
        this.headerFormGroup = this.formBuilder.group({
            ssn: [this.headerModel.ssn, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.ssnReg), Validation.ValidateNumericWithNoAllZeroInput]]
        });

        this.headerFormGroup.valueChanges.subscribe(form => {
            this.emitValueChange();
        });
    }
}