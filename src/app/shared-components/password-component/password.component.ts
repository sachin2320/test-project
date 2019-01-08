import { OnInit, Component, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AppConfig } from "app/configuration/app.config";
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'password',
    templateUrl: './password.component.html'
})

export class PasswordComponent implements OnInit {

    formGroup: FormGroup = null;

    @Input('currentPwdPlaceholder') currentPwdPlaceholder: string = "Current password";
    @Input('newPwdPlaceholder') newPwdPlaceHolder: string = "Password";
    @Input('confirmPwdPlaceholder') confirmPwdPlaceholder: string = "Confirm password";

    @Input('showPwdHint') showPwdHint: boolean = false;
    @Input('showCurrentPwd') showCurrentPwd: boolean = false;

    @Output('onComponentValidated')
    dataIsValid = new EventEmitter();

    @Output('onComponentValueChanged')
    formValue = new EventEmitter();

    public firstName:string="";
    public userName:string="";
    
    public isPwdHintNeedToShow: boolean = false;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.setupFormGroup();
        this.setupEventEmitter();
    }
   
    setupFormGroup() {
        this.formGroup = this.formBuilder.group({
            currentPassword: ['', (this.showCurrentPwd ? [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.pwdReg), Validators.minLength(10), Validators.maxLength(100)] : null)],
            password: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.pwdReg), Validators.minLength(10), Validators.maxLength(100)]],
            confirmPassword: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.pwdReg), Validators.minLength(10), Validators.maxLength(100)]],
        }, {
                validator: (group: FormGroup) => {
                    group.controls.password.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.password,group.controls.confirmPassword);
                    });
                    group.controls.confirmPassword.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.password,group.controls.confirmPassword);
                    });
                }
            });

        this.formGroup.controls.password.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((inputString: string) => {
            let error = this.formGroup.controls.password.errors != null ? this.formGroup.controls.password.errors.pattern : null;
            if (error != undefined && error != null && this.showPwdHint)
                this.isPwdHintNeedToShow = true; 
            else
                this.isPwdHintNeedToShow = false;
        });
    }

    setupEventEmitter() {
        this.formGroup.valueChanges.subscribe(form => {
            let isValid = this.formGroup.valid;
            this.dataIsValid.emit({ FormIsValid: isValid });
            this.formValue.emit({ FormIsValid: isValid, FormData: form });
        });
    }
}