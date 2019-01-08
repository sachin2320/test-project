
import { AppConfig } from "app/configuration/app.config";
import { AuthenticationService } from "app/services/auth-service/authentication.service";
import { ForgotPasswordService } from "app/services/registration/forgot-password.service";
import { OnInit, Component, Input } from "@angular/core";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";
import { Validation } from "app/shared-services/validation.service";
import { Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'forgot-password',
    styles: [],
    templateUrl: './forgot-password.component.html'
})

export class ForgotPasswordComponent implements OnInit {
    public userInfoForm: any = {};

    public securityQuestion: string = "";
    public securityQuestionId: number;
    public securityQuestionOrder: number;
    public successMessage: string = "";
    public errorMessage: string;

    isUserDataValid: boolean = false;
    isValidationSuccess = false;
    isAccountLocked = false;
    accountLockedMsg: string = "";

    public questions: any[] = [];
    public currentQuestionIndex: number = -1;

    constructor(private formBuilder: FormBuilder,
        private service: ForgotPasswordService,
        private spinner: SpinnerService,
        private notification: SnackbarService,
        public config: AppConfig,
        private authService: AuthenticationService) {

        this.userInfoForm = this.formBuilder.group({
            userName: ['', Validation.ValidateRequiredWithNoEmptySpaceInput],
            lastName: ['', Validation.ValidateRequiredWithNoEmptySpaceInput],
            ssn: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.ssnDigitReg), Validation.ValidateNumericWithNoAllZeroInput]],
            answer: ['']
        });
    }

    ngOnInit() {

    }

    nextClick() {
        this.errorMessage = "";
        this.spinner.start();
        this.service.userSecurityQuestions(this.userInfoForm.value.userName, this.userInfoForm.value.lastName, this.userInfoForm.value.ssn)
            .subscribe(res => {
                this.spinner.stop();
                if (res.isSuccess) {
                    this.questions = res.data.questions;
                    this.nextQuestion()
                    this.isUserDataValid = true;
                }
                else {
                    if (!this.isUserLocked(res))
                        this.setErrorMessage(res);
                }
            },
            error => {
                this.setErrorMessage(error);
            });
    }

    submit() {
        this.errorMessage = "";
        this.spinner.start();
        var userName = this.userInfoForm.value.userName;
        var lastName = this.userInfoForm.value.lastName;
        var ssn = this.userInfoForm.value.ssn;
        var answer = this.userInfoForm.value.answer;

        this.service.verifyUserSecurityAnswer(this.securityQuestionId, answer, userName, lastName, ssn, "", null, this.securityQuestionOrder)
            .subscribe(res => {
                this.spinner.stop();
                if (res.isSuccess) {
                    this.spinner.start();
                    this.service.generateTempPassword(userName, this.securityQuestionId, answer)
                        .subscribe(res1 => {
                            this.spinner.stop();
                            if (res1.isSuccess) {
                                this.successMessage = res1.message;
                                this.isValidationSuccess = true;
                            }
                            else {
                                if (!this.isUserLocked(res1))
                                    this.setErrorMessage(res1);
                            }
                        }, error1 => {
                            this.setErrorMessage(error1);
                        });
                }
                else {
                    if (!this.nextQuestion()) {
                        if (!this.isUserLocked(res))
                            this.setErrorMessage(res);
                    }
                    else {
                        this.setErrorMessage(res);
                    }
                }
            },
            error => {
                this.setErrorMessage(error);
            });
    }

    nextQuestion(): boolean {
        this.currentQuestionIndex = this.currentQuestionIndex + 1;
        if (this.currentQuestionIndex <= this.questions.length - 1) {
            this.securityQuestion = this.questions[this.currentQuestionIndex].questionDescription;
            this.securityQuestionId = this.questions[this.currentQuestionIndex].questionId;
            this.securityQuestionOrder = this.questions[this.currentQuestionIndex].securityQuestionOrder;
            this.userInfoForm.controls['answer'].setValue('');

            return true;
        }
        else {
            return false;
        }
    }

    isUserLocked(res: any): boolean {
        //TODO :  Once message get finalized for throug out then app then need to remove below check condition
        if (res.code == "1081" || res.code == "1082" || res.code == "1083" || res.code == "1084" || res.code == "1085") { //User is permanent/temp Locked
            this.isAccountLocked = true;
            this.accountLockedMsg = res.message;
            return true
        }
        return false;
    }

    setErrorMessage(res: any) {
        let message = "";
        if (typeof res === 'string')
            message = res;
        else
            message = res.message;

        this.spinner.stop();
        this.errorMessage = message;
        this.notification.popupSnackbar(message);
    }
}