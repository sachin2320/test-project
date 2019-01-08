import { Component, OnInit, Renderer2 } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { AppConfig } from "app/configuration/app.config";
import { AnswerVerificationType } from "app/enums/account-action-category.enum";
import { ForgotPasswordService } from "app/services/registration/forgot-password.service";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'email-updation',
    styles: [],
    templateUrl: './email-updation.component.html'
})

export class EmailUpdationComponent implements OnInit {
    public emailUpdationForm: any = {};

    public userName: string = "";
    public subscribe: any;

    public isUserDataValid: boolean = false;
    public isValidationSuccess = false;
    public isAccountLock = false;

    public questions: any[] = [];
    public currentQuestionIndex: number = -1;

    public securityQuestion: string = "";
    public securityQuestionId: number;
    public successMessage: string = "";
    public errorMessage: string;
    public showPrimaryEmailSection: boolean = true;

    protected isEmailValid: boolean = true;

    constructor(private service: ForgotPasswordService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private spinner: SpinnerService,
        private notification: SnackbarService,
        public config: AppConfig,
        private renderer: Renderer2) {

        this.emailUpdationForm = this.formBuilder.group({
            ssn: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.ssnDigitReg), Validation.ValidateNumericWithNoAllZeroInput]],
            policyNumber: ['', Validation.ValidateRequiredWithNoEmptySpaceInput],
            answer: ['', Validation.ValidateRequiredWithNoEmptySpaceInput],
            email: [''],
            confirmEmail: [''],
            isPrimaryEmail: []
        },
            {
                validator: (group: FormGroup) => {
                    group.controls.email.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.email, group.controls.confirmEmail, false);
                    });
                    group.controls.confirmEmail.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.email, group.controls.confirmEmail, false);
                    });
                }
            });

        this.subscribe = this.route.queryParams.subscribe(params => {
            this.userName = params["userName"];
        });
    }

    ngOnInit() {
        this.userQuestionGet();
    }

    navigationClick() {
        this.errorMessage = "";
        this.spinner.start();
        let emailUpdationFormValue = this.emailUpdationForm.value;
        this.service.verifyUserSecurityAnswer(
            this.securityQuestionId,
            emailUpdationFormValue.answer,
            this.userName, "",
            emailUpdationFormValue.ssn,
            emailUpdationFormValue.policyNumber,
            AnswerVerificationType.UpdateEmail
        )
            .subscribe(res => {
                this.spinner.stop();
                if (res.isSuccess) {
                    this.isUserDataValid = true;
                    this.setEmailValidator();
                }
                else {
                    if (!this.nextQuestion())
                        this.isAccountLock = true;

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

    submit() {
        this.errorMessage = "";
        this.spinner.start();
        var ssn = this.emailUpdationForm.value.ssn;
        var policyNumber = this.emailUpdationForm.value.policyNumber;
        var answer = this.emailUpdationForm.value.answer;
        var email = this.emailUpdationForm.value.email;

        this.service.changeUserEmail(email, this.securityQuestionId, answer, "", ssn, policyNumber,
            this.emailUpdationForm.value.isPrimaryEmail)
            .subscribe(res1 => {
                this.spinner.stop();
                if (res1.isSuccess) {
                    this.successMessage = res1.message;
                    this.isValidationSuccess = true;
                }
                else {
                    this.errorMessage = res1.message;
                    this.notification.popupSnackbar(res1.message);
                }
            }, error1 => {
                this.spinner.stop();
                this.errorMessage = error1;
                this.notification.popupSnackbar(error1);
            });
    }

    nextQuestion(): boolean {
        this.currentQuestionIndex = this.currentQuestionIndex + 1;
        if (this.currentQuestionIndex <= this.questions.length - 1) {
            this.securityQuestion = this.questions[this.currentQuestionIndex].questionDescription;
            this.securityQuestionId = this.questions[this.currentQuestionIndex].questionId;

            if (this.emailUpdationForm.controls['answer'].value != '') {
                this.emailUpdationForm.controls['answer'].setValue('');
                const element = this.renderer.selectRootElement('#answer');
                setTimeout(() => element.focus(), 0);
            }

            return true;
        }
        else {
            return false;
        }
    }

    userQuestionGet() {
        this.errorMessage = "";
        this.spinner.start();
        this.service.userSecurityQuestions(this.userName)
            .subscribe(res => {
                this.spinner.stop();
                if (res.isSuccess) {
                    this.questions = res.data.questions;
                    this.nextQuestion()
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

    onEmailComponentValueChanged(event) {
        this.emailUpdationForm.controls["email"].setValue(event.FormData.email);
        this.emailUpdationForm.controls["confirmEmail"].setValue(event.FormData.confirmEmail);
        this.emailUpdationForm.controls["isPrimaryEmail"].setValue(event.FormData.isPrimaryEmail);
        Validation.ValidateForm(this.emailUpdationForm);
        this.isEmailValid = Validation.emailReg.test(this.emailUpdationForm.controls.email.value);
    }

    setEmailValidator() {
        let controls = this.emailUpdationForm.controls;
        let email = controls["email"];
        let confirmEmail = controls["confirmEmail"];
        email.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
        email.setValidators(Validators.email);
        confirmEmail.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
        confirmEmail.setValidators(Validators.email);
        Validation.ValidateForm(this.emailUpdationForm);
    }

    ngOnDestroy() {
        this.subscribe.unsubscribe();
    }
}    