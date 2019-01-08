import { Component, OnInit } from "@angular/core";
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { AppConfig } from "app/configuration/app.config";
import { EmailVerificationService } from "app/services/registration/email-verification.service";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'email-verification',
    styles: [],
    templateUrl: './email-verification.component.html'
})

export class EmailVerificationComponent implements OnInit {
    emailVerificationForm: any = {};

    errorMessage: string;
    userName: string = "";
    userEmail: string = "";

    isInvalidCode: boolean = false;
    IsVerificationDone: boolean = false;
    isResendTokenSuccess: boolean = false;
    resendTokenSuccessMsg: string = "";

    constructor(private verificationService: EmailVerificationService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private spinner: SpinnerService,
        private notification: SnackbarService,
        public config: AppConfig,
        private router: Router) {

        this.emailVerificationForm = this.formBuilder.group({
            code: ['', Validation.ValidateRequiredWithNoEmptySpaceInput]
        });

        this.userName = this.route.snapshot.paramMap.get('username');
        this.userEmail = this.route.snapshot.paramMap.get('email');
    }

    ngOnInit() {
    }

    submit() {
        this.errorMessage = "";
        this.spinner.start();
        this.verificationService.confirmEmail(this.userName, this.emailVerificationForm.value.code)
            .subscribe(res => {
                this.spinner.stop();
                if (res.isSuccess) {
                    this.IsVerificationDone = true;
                }
                else {
                    if (res.code == "1017")
                        this.isInvalidCode = true;
                    else if (res.code == "1016") {
                        this.errorMessage = this.config.getConfig("invalidEmailVerificationUrl");
                        this.notification.popupSnackbar(this.config.getConfig("invalidEmailVerificationUrl"));
                    }
                    else {
                        this.errorMessage = res.message;
                        this.notification.popupSnackbar(res.message);
                    }
                }
            },
                error => {
                    this.spinner.stop();
                    this.errorMessage = error;
                    this.notification.popupSnackbar(error);
                });
    }

    resendEmailConfirmationToken() {
        this.errorMessage = "";
        this.spinner.start();
        this.verificationService.resendEmailConfirmationToken(this.userName)
            .subscribe(res => {
                this.spinner.stop();
                if (res.isSuccess) {
                    this.isResendTokenSuccess = true;
                    this.resendTokenSuccessMsg = res.message;
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

    updateEmailAndResendCode() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "userName": this.userName
            },
            skipLocationChange: true
        };
        this.router.navigate([this.config.getConfig('appUpdateEmailUrl')], navigationExtras);
    }
}    