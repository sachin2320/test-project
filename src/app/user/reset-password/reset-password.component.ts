import { AppConfig } from "app/configuration/app.config";
import { ActivatedRoute } from "@angular/router";
import { ForgotPasswordService } from "app/services/registration/forgot-password.service";
import { OnInit, Component, Input } from "@angular/core";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";
import { Validation } from "app/shared-services/validation.service";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'reset-password',
    styles: [],
    templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {

    passwordInfoForm: any = {};

    isPasswordChanged: boolean = false;
    isStrongPassword: boolean = true;

    public userName: string = "";
    public tempPassword: string = "";
    public errorMessage: string = "";

    constructor(private formBuilder: FormBuilder,
        private service: ForgotPasswordService,
        private spinner: SpinnerService,
        private notification: SnackbarService,
        private route: ActivatedRoute,
        public config: AppConfig) {

        this.passwordInfoForm = this.formBuilder.group({
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
        var queryParam = this.route.snapshot.params;
        if (queryParam != null && queryParam != undefined) {
            this.userName = this.route.snapshot.params.username || "";
            this.tempPassword = this.route.snapshot.params.temppassword || "";
        }
    }

    resetPassword() {
        this.errorMessage = "";

        if (this.userName == "" || this.tempPassword == "") {
            this.errorMessage = this.config.getConfig("invalidUrl");
            return;
        }

        this.spinner.start();
        this.service.changeTempPassword(this.userName, this.tempPassword, this.passwordInfoForm.value.password)
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
                this.errorMessage = error;
                this.notification.popupSnackbar(error);
            });
    }

    onPasswordComponentValueChanged(event) {
        this.passwordInfoForm.controls["password"].setValue(event.FormData.password);
        this.passwordInfoForm.controls["confirmPassword"].setValue(event.FormData.confirmPassword);
        Validation.ValidateForm(this.passwordInfoForm);
    }
}