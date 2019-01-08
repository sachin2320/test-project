import { AppConfig } from "app/configuration/app.config";
import { ActivatedRoute } from "@angular/router";
import { ForgotPasswordService } from "app/services/registration/forgot-password.service";
import { OnInit, Component, Input } from "@angular/core";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";
import { Validation } from "app/shared-services/validation.service";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserPermissionKey } from "app/enums/user-permission-key.enum";
import { UtilityService } from "app/services/helper/utility.service";

@Component({
    selector: 'change-password',
    styles: [],
    templateUrl: './change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {

    passwordInfoForm: any = {};

    public isPasswordChanged: boolean = false;
    public tempPassword: string = "";
    public errorMessage: string = "";

    constructor(private formBuilder: FormBuilder,
        private service: ForgotPasswordService,
        private spinner: SpinnerService,
        private notification: SnackbarService,
        private route: ActivatedRoute,
        public config: AppConfig,
        private utilityService: UtilityService) {

        this.passwordInfoForm = this.formBuilder.group({
            currentPassword: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.pwdReg), Validators.minLength(10), Validators.maxLength(100)]],
            password: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.pwdReg), Validators.minLength(10), Validators.maxLength(100)]],
            confirmPassword: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.pwdReg), Validators.minLength(10), Validators.maxLength(100)]],
        }, {
                validator: (group: FormGroup) => {
                    group.controls.password.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.password, group.controls.confirmPassword);
                    });
                    group.controls.confirmPassword.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.password, group.controls.confirmPassword);
                    });
                }
            });
    }

    ngOnInit() {
        //If simulated user has no permission to change password, display error message to user 
        if(!this.utilityService.isSimulatedUserHasPermission(UserPermissionKey.perm_update_password_key))
            this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');
    }

    changePassword() {
        //If simulated user has no permission to change password, display error message to user 
        //otherwise allow user to change password.
        if(!this.utilityService.isSimulatedUserHasPermission(UserPermissionKey.perm_update_password_key))
        {
            this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');
            return false;
        }

        //Change password
        this.errorMessage = "";
        this.spinner.start();
        this.service.changePassword(this.passwordInfoForm.value.currentPassword,
            this.passwordInfoForm.value.password, this.passwordInfoForm.value.confirmPassword)
            .subscribe(res => {
                this.spinner.stop();
                if (res.isSuccess) {
                    this.isPasswordChanged = true;
                }
                else {
                    this.errorMessage = res.message;
                    this.notification.popupSnackbar(res.message);
                }
            },
            error => {
                this.spinner.stop();
                this.errorMessage = error;
                this.notification.popupSnackbar(error);
            });
    }

    onPasswordComponentValueChanged(event) {
        this.passwordInfoForm.controls["currentPassword"].setValue(event.FormData.currentPassword);
        this.passwordInfoForm.controls["password"].setValue(event.FormData.password);
        this.passwordInfoForm.controls["confirmPassword"].setValue(event.FormData.confirmPassword);
        Validation.ValidateForm(this.passwordInfoForm);
    }
}