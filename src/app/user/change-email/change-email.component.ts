import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from "app/configuration/app.config";
import { UserPermissionKey } from "app/enums/user-permission-key.enum";
import { UtilityService } from "app/services/helper/utility.service";
import { ForgotPasswordService } from "app/services/registration/forgot-password.service";
import { SpinnerService } from "app/shared-services/spinner.service";
import { Validation } from "app/shared-services/validation.service";
import { PolicyService } from "app/services/policy/policy.service";

@Component({
    selector: 'change-email',
    styles: [],
    templateUrl: './change-email.component.html'
})

export class ChangeEmailComponent implements OnInit {
    emailInfoForm: any = {};
    public isEmailChanged: boolean = false;
    public errorMessage: string = "";
    public successMessage: string = "";
    public showPrimaryEmailSection: boolean = false;

    constructor(private formBuilder: FormBuilder,
        private service: ForgotPasswordService,
        private spinner: SpinnerService,
        public config: AppConfig,
        private utilityService: UtilityService,
        private policyService: PolicyService
    ) {
        this.emailInfoForm = this.formBuilder.group({
            currentEmail: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.emailReg)]],
            email: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.emailReg)]],
            confirmEmail: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.emailReg)]],
            isPrimaryEmail: []
        }, {
                validator: (group: FormGroup) => {
                    group.controls.email.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.email, group.controls.confirmEmail, false);
                        // Validation.ValidateNotEqual(group.controls.email, group.controls.currentEmail, false);
                    });
                    group.controls.confirmEmail.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.email, group.controls.confirmEmail, false);
                        // Validation.ValidateNotEqual(group.controls.confirmEmail, group.controls.currentEmail, false);
                    });
                }
            });
    }

    ngOnInit() {
        //If simulated user has no permission to change email, display error message to user 
        if (!this.utilityService.isSimulatedUserHasPermission(UserPermissionKey.perm_update_email_key))
            this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');

        this.isUserHasActivePolicy();
    }

    changeEmail() {
        //If simulated user has no permission to change email, display error message to user 
        //otherwise allow user to change email.
        if (!this.utilityService.isSimulatedUserHasPermission(UserPermissionKey.perm_update_email_key)) {
            this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');
            return false;
        }

        //Change email
        this.errorMessage = "";
        this.spinner.start();
        this.service.changeEmail(
            this.emailInfoForm.value.currentEmail,
            this.emailInfoForm.value.email,
            this.emailInfoForm.value.confirmEmail,
            this.emailInfoForm.value.isPrimaryEmail
        ).subscribe(res => {
            this.spinner.stop();
            if (res.isSuccess) {
                this.isEmailChanged = true;
                this.successMessage = res.message;
            }
            else {
                this.errorMessage = res.message;
            }
        },
            error => {
                this.spinner.stop();
                this.errorMessage = error;
            });
    }

    onEmailComponentValueChanged(event) {
        this.emailInfoForm.controls["currentEmail"].setValue(event.FormData.currentEmail);
        this.emailInfoForm.controls["email"].setValue(event.FormData.email);
        this.emailInfoForm.controls["confirmEmail"].setValue(event.FormData.confirmEmail);
        this.emailInfoForm.controls["isPrimaryEmail"].setValue(event.FormData.isPrimaryEmail);
        Validation.ValidateForm(this.emailInfoForm);
    }

    isUserHasActivePolicy() {
        this.errorMessage = "";
        this.policyService.isUserHasActivePolicy()
            .subscribe(res => {
                if (res.isSuccess) {
                    this.showPrimaryEmailSection = res.data.isActivePolicy;
                }
                else {
                    this.errorMessage = "";
                }
            },
                error => {
                    this.errorMessage = error;
                });
    }

}