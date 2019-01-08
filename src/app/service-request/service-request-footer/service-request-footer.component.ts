import { OnInit, Component, Input, Output, EventEmitter, SimpleChanges, SimpleChange, OnChanges } from "@angular/core";
import { ServiceRequestType } from "app/enums/service-type.enum";
import { ServiceRequestFooterModel } from "app/models/serviceRequesterFooter.model";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Validation } from "app/shared-services/validation.service";
import { AppConfig } from "app/configuration/app.config";
import { UtilityService } from "app/services/helper/utility.service";
import { ServiceRequestDisclosureModel } from "app/models/serviceRequestDisclosure.model";

@Component({
    selector: 'servicerequest-footer',
    styles: [],
    templateUrl: './service-request-footer.component.html'
})

export class ServiceRequestFooterComponent implements OnInit,OnChanges {
    @Input('model') model: ServiceRequestFooterModel = null;
    @Input('isviewonly') isViewOnly: boolean = false;
    @Input('isprintonly') isPrintOnly: boolean = false;
    @Input('servicetype') serviceType: ServiceRequestType = ServiceRequestType.None;

    @Output('onfootervaluechanged')
    footerValueChanged = new EventEmitter();

    public footerForm: FormGroup = null;
    public dateFormat: string;
    public authorizationChkBoxItems: ServiceRequestDisclosureModel[] = [];

    constructor(private formBuilder: FormBuilder, public config: AppConfig, private utility: UtilityService) {
        this.dateFormat = this.config.getConfig("date_format");
    }

    ngOnInit() {
        if (this.model == null)
            this.model = new ServiceRequestFooterModel();

        if (this.model.authorizationChkBoxItems == null || this.model.authorizationChkBoxItems.length <= 0) {
            this.model.authorizationChkBoxItems = this.utility.getServiceAgreementList(this.serviceType);
        }
        else {
            this.authorizationChkBoxItems = this.model.authorizationChkBoxItems;
        }
        this.setupFooterForm();
    }

    setupFooterForm() {
        this.footerForm = this.formBuilder.group({
            ownerInitials: [this.model.ownerInitials, Validation.ValidateRequiredWithNoEmptySpaceInput],
            ownerDob: [this.model.ownerDob, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.dobReg)]],
            last4DigitSsn: [this.model.last4DigitSsn, [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.ssnDigitReg), Validation.ValidateNumericWithNoAllZeroInput]],
            isAgreementAccepted: [{ value: this.model.isAgreementAccepted, disabled: (this.isViewOnly ? true : false) }, Validators.required],
            agreementText: [this.model.agreementText],
            authorizationChkBoxItems: new FormControl(this.authorizationChkBoxItems)
        }, {
                validator: (formGroup: FormGroup) => {
                    formGroup.controls.ownerDob.valueChanges.subscribe(() => {
                        Validation.ValidateDob(formGroup.controls.ownerDob);
                    });
                }
            });

        this.footerForm.valueChanges.subscribe(form => {
            this.emitValueChange();
        });
    }

    emitValueChange() {
        let isValid = this.footerForm.valid;       
        this.footerValueChanged.emit({ IsAgreementAccepted: this.isAllAgreementAccepted, IsDataVaid: isValid, FooterData: this.footerForm.value });
    }

    agreementAccepted(event: any) {
        this.emitValueChange();
    }

    ngOnChanges(changes: SimpleChanges) {        
        const pageModel: SimpleChange = changes.model;
        if (pageModel != undefined && !pageModel.firstChange) {
           this.model = pageModel.currentValue;          
           this.authorizationChkBoxItems=this.model.authorizationChkBoxItems;
        }
    }
    
    private get isAllAgreementAccepted(): boolean {
        let isPass: boolean = true;
        this.authorizationChkBoxItems.forEach(x => {
            if (isPass)
                isPass = x.isDisclosureAccepted;
        });
        return isPass;
    }

    onOwnerInfoKeyup(event: any)
    {
        if(event.target.name == "ownerDob"){
            $("#dvOwnerDob").find(".mat-form-field-underline").removeClass("border1px-red");
            $("#dvOwnerDob").find(".mat-form-field-ripple").removeClass("border1px-red");
        }
        else if(event.target.name == "ownerSsn"){
            $("#dvOwnerSsn").find(".mat-form-field-underline").removeClass("border1px-red");
            $("#dvOwnerSsn").find(".mat-form-field-ripple").removeClass("border1px-red");
        }
    }
}