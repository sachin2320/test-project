import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from "app/configuration/app.config";
import { RegistrationModel } from "app/models/Registration.model";
import { SecurityQuestionModel } from "app/models/securityQuestion.model";
import { AuthenticationService } from "app/services/auth-service/authentication.service";
import { PolicyService } from "app/services/policy/policy.service";
import { RegistrationService } from "app/services/registration/registration.service";
import { CommonService } from "app/shared-services/common.service";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'user-registration',
    styles: [],
    templateUrl: './registration.component.html'
})

export class RegistrationComponent implements OnInit {
    isNextVisible: boolean = true;
    isPrevVisible: boolean = false;
    isCancelVisible: boolean = true;
    isRegisterVisible: boolean = false;
    isAgreementAccepted: boolean = false;
    isTermAndConditionClicked: boolean = true; // false;
    isCaptchaAvailable: boolean = false;

    captchaResponse: string = "";
    showRecaptcha: boolean = this.config.getConfig('showRecaptcha') == null || this.config.getConfig('showRecaptcha');
    isCaptchaValid: boolean = !this.showRecaptcha; // false;

    isPolicyValid: boolean = false;
    isUserIdInUsed: boolean = false;
    isEmailIdInUsed: boolean = false;
    isRegistrationComplete: boolean = false;

    isPolicyVerifying: boolean = false;
    isUserIdVerifying: boolean = false;

    isStrongUsername: boolean = true;

    currentTabIndex: number = 0;
    totalTabCount: number = 4; //Tab count is fixed and it is not going to be change

    securityQuestion: SecurityQuestionModel = null;
    successMessage: string;
    errorMessage: string;

    personalInfoForm: any = {};
    userInfoForm: any = {};
    securityInfoForm: any = {};

    recaptchaPublicKey: string = this.config.getConfig('recaptchaPublicKey'); 

    constructor(private spinner: SpinnerService,
        private commonService: CommonService,
        private policyService: PolicyService,
        private registrationService: RegistrationService,
        private formBuilder: FormBuilder,
        public config: AppConfig,
        private notification: SnackbarService,
        private authService: AuthenticationService) {

        this.securityQuestion = new SecurityQuestionModel([], [], []);
        this.setupFormFields();
    }

    ngOnInit() {
        this.setupQuestion();
        this.isCaptchaAvailable = false;
    }

    checkSecurityCustomQuestionsAndAnswersNotMatch(valuesToMatch)
    {
        valuesToMatch = valuesToMatch.concat(this.securityQuestion.securityQuestion1.map(x=>x.questionDescription),this.securityQuestion.securityQuestion2.map(x=>x.questionDescription).filter(x => x != "Create your own custom question"),this.securityQuestion.securityQuestion3.map(x=>x.questionDescription).filter(x => x != "Create your own custom question"));
        var matchedValues = [];
        var isMatchingSecurityInfo = false;
        for(var i = 0; i < valuesToMatch.length; i++) {
            if(valuesToMatch[i] != ""){
                if(matchedValues[valuesToMatch[i].trim()] === undefined) {
                    matchedValues[valuesToMatch[i].trim()] = 1;
                } 
                else{
                    isMatchingSecurityInfo = true;
                }
            }
        }
        return isMatchingSecurityInfo;
    }

    submit() {
        this.errorMessage = "";
        let data: any = {};
        Object.assign(data, this.personalInfoForm.value, this.userInfoForm.value);
        Object.assign(data, this.securityInfoForm.value);

        let isIndividual = Boolean(JSON.parse(data.individual));

        let registrationModel: RegistrationModel = new RegistrationModel(data.individual,
            (isIndividual ? data.ownerFirstName : ""),
            (isIndividual ? data.ownerLastName : ""),
            (isIndividual ? data.ownerMiddleName : ""),
            data.ownerSsn.replace(/-/g, ''),
            data.countryCode,
            data.dayTimePhone,
            data.dayTimePhoneExt,
            data.zip,
            data.policyNumber,
            data.policyNickName,
            data.email,
            data.confirmEmail,
            data.userId,
            data.password,
            data.confirmPassword,
            data.securityQuestionId1,
            data.securityQuestionId2,
            data.securityQuestionId3,
            data.answer1,
            data.answer2,
            data.answer3,
            data.customQuestion1,
            data.customQuestion2,
            data.customQuestion3,
            (!isIndividual ? data.trustName : ""),
            this.captchaResponse);

        let valuesToMatch: any= [registrationModel.answer1,registrationModel.answer2,registrationModel.answer3,
            registrationModel.securityCustomQuestion1,registrationModel.securityCustomQuestion2,
            registrationModel.securityCustomQuestion3];
        let isMatchingSecurityInfo = this.checkSecurityCustomQuestionsAndAnswersNotMatch(valuesToMatch);

        if(!isMatchingSecurityInfo){
            this.spinner.start();
            this.registrationService.registerUser(registrationModel).subscribe(res => {
                this.spinner.stop();
                if (res.success) {
                    this.isRegistrationComplete = true;
                    this.successMessage = res.message;
                }
                else {
                    this.setUpError(res.message);
                    // this.captchaResponse = "";
                    // this.isCaptchaValid = false;
                }
            },
                error => {
                    this.setUpError(error);
                    // this.captchaResponse = "";
                    // this.isCaptchaValid = false;
                });
        }
        else
        {
            this.setUpError(this.config.getConfig("security_cutomquestion_answer_match_err"));
        }
    }

    tabIndexChange(val: number) {
        this.navigate(val);
    }

    navigationClick(moveNext: boolean) {
        this.errorMessage = "";
        this.notification.popupSnackbar("");
        let nextTabIndex: number = 0;
        if (moveNext) {
            nextTabIndex = this.currentTabIndex + 1;
            if (nextTabIndex == 1) { // Welcome
                this.navigate(nextTabIndex);
            }
            else if (nextTabIndex == 2 && this.isCaptchaValid) { // Personal & Policy Info
                this.checkPolicy();
            }
            else if (nextTabIndex == 3) { // User Info
                this.checkUserAndEmailId();
                this.resizeCaptcha();
            }
        }
        else {
            nextTabIndex = this.currentTabIndex - 1;
            this.navigate(nextTabIndex);
        }
    }

    resizeCaptcha() {
        var iframes = document.querySelectorAll("iframe");
        for (var i = 0; i < iframes.length; i++) {
            if (iframes[i].height == "78")
                iframes[i].height = '90';
        }
    }

    navigate(navigateToIndex: number) {
        this.isNextVisible = true;
        this.isPrevVisible = true;
        this.isCancelVisible = false;
        this.isRegisterVisible = false;
        this.isCaptchaAvailable = false;
        if (navigateToIndex == (this.totalTabCount - 1)) { // last tab
            if (this.securityQuestion == null ||
                this.securityQuestion.securityQuestion1.length <= 0 ||
                this.securityQuestion.securityQuestion2.length <= 0 ||
                this.securityQuestion.securityQuestion3.length <= 0)
                this.setupQuestion(true,true);

            this.isCaptchaAvailable = true;
            this.isRegisterVisible = true;
            // this.isRegisterVisible = this.isCaptchaValid; // MJD 2018-06-27 true;
            this.isNextVisible = false;
        }
        if (navigateToIndex == 0) { //First tab
            this.isPrevVisible = false;
            this.isCancelVisible = true;
            this.isCaptchaAvailable = false;
        }
        if (navigateToIndex == 1) { // Second tab
            this.isCaptchaAvailable = true;
        }

        this.currentTabIndex = navigateToIndex;
    }

    setupQuestion(isDisplaySpinner: boolean = false, isDisplayError: boolean = false) {
        if (isDisplaySpinner)
            this.spinner.start();

        this.commonService.getSecurityQuestion().subscribe(res => {
            this.spinner.stop();
            this.securityQuestion = res;
        },
            error => {
                if (isDisplayError)
                    this.setUpError(this.config.getConfig("security_question_fetch_err"));
            });
    }

    setupFormFields() {
        this.setupPersonalInfoFields();
        this.setupUserInfoFields();
        this.setupQuestionInfoFields();
    }

    setupPersonalInfoFields() {
        this.personalInfoForm = this.formBuilder.group({
            ownerFirstName: ['', Validation.ValidateRequiredWithNoEmptySpaceInput],
            ownerLastName: ['', Validation.ValidateRequiredWithNoEmptySpaceInput],
            ownerMiddleName: [''],
            trustName: [''],
            ownerSsn: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.ssnReg), Validation.ValidateNumericWithNoAllZeroInput]],
            dayTimePhone: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.phoneNumberChkReg), Validation.ValidateNumericWithNoAllZeroInput]],
            zip: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.zipCodeReg), Validation.ValidateNumericWithNoAllZeroInput]],
            individual: [true],
            policyNumber: ['', Validation.ValidateRequiredWithNoEmptySpaceInput],
            honeypot: [''],
        });

        let personalInfoControls = this.personalInfoForm.controls;
        personalInfoControls.policyNumber.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((inputString: string) => { this.markPolicyAsChanged(); });
        personalInfoControls.ownerSsn.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((inputString: string) => { this.markPolicyAsChanged(); });
        personalInfoControls.ownerLastName.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((inputString: string) => { this.markPolicyAsChanged(); });
        personalInfoControls.trustName.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((inputString: string) => { this.markPolicyAsChanged(); });
    }

    setupQuestionInfoFields() {
        this.securityInfoForm = this.formBuilder.group({
            securityQuestionId1: ['', Validation.ValidateRequiredWithNoEmptySpaceInput],
            customQuestion1: [''],
            securityQuestionId2: ['', Validation.ValidateRequiredWithNoEmptySpaceInput],
            customQuestion2: [''],
            securityQuestionId3: ['', Validation.ValidateRequiredWithNoEmptySpaceInput],
            customQuestion3: [''],
            answer1: ['', Validation.ValidateRequiredWithNoEmptySpaceInput],
            answer2: ['', Validation.ValidateRequiredWithNoEmptySpaceInput],
            answer3: ['', Validation.ValidateRequiredWithNoEmptySpaceInput]
        });
    }

    setupUserInfoFields() {
        this.userInfoForm = this.formBuilder.group({
            userId: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.userIdReg), Validators.minLength(8), Validators.maxLength(50)]],
            password: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.pwdReg), Validators.minLength(10), Validators.maxLength(100)]],
            confirmPassword: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.pwdReg), Validators.minLength(10), Validators.maxLength(100)]],
            email: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.email]],
            confirmEmail: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.email,]]
        },
            {
                validator: (formGroup: FormGroup) => {
                    formGroup.controls.email.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(formGroup.controls.email, formGroup.controls.confirmEmail, false);
                    });
                    formGroup.controls.confirmEmail.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(formGroup.controls.email, formGroup.controls.confirmEmail, false);
                    });

                    formGroup.controls.password.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(formGroup.controls.password, formGroup.controls.confirmPassword);
                    });
                    formGroup.controls.confirmPassword.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(formGroup.controls.password, formGroup.controls.confirmPassword);
                    });
                }
            });

        this.userInfoForm.controls.userId.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((inputString: string) => {
            this.isStrongUsername = !this.isControlContainError(this.userInfoForm.controls.userId);
            this.isUserIdInUsed = true;
            this.errorMessage = "";
        });

        this.userInfoForm.controls.email.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((inputString: string) => {
            this.isEmailIdInUsed = true;
            this.errorMessage = "";
        });
    }

    checkPolicy() {
        this.errorMessage = "";
        let policyNumber: string = this.personalInfoForm.controls.policyNumber.value;
        if (policyNumber) {
            this.spinner.start();
            let isIndividual = Boolean(JSON.parse(this.personalInfoForm.controls.individual.value));
            let ownerLastName = isIndividual ? this.personalInfoForm.controls.ownerLastName.value : "";
            let trustName = !isIndividual ? this.personalInfoForm.controls.trustName.value : "";
            let ownerSsn = this.personalInfoForm.controls.ownerSsn.value.replace(/-/g, '');
            this.policyService.isPolicyExists(policyNumber, ownerLastName, ownerSsn, trustName).subscribe(res => {
                this.spinner.stop();
                if (res.errorCode) {
                    this.setUpError(res.message);
                    this.isPolicyValid = false;
                }
                else {
                    this.currentTabIndex = this.currentTabIndex + 1; //Moving to next tab
                    this.isPolicyValid = true;
                }
            },
                error => {
                    this.setUpError(this.config.getConfig("policyCheckError"));
                });
        }
    }

    checkUserAndEmailId() {
        this.errorMessage = "";
        let controlUser = this.userInfoForm.controls.userId;
        let controlEmail = this.userInfoForm.controls.email;

        let userId: string = controlUser.value;
        let emailId: string = controlEmail.value;

        if (userId || emailId) {
            this.spinner.start();
            this.registrationService.isUserIdAndEmailInUsed(userId, emailId).subscribe(res => {
                this.spinner.stop();
                if (res.errorCode) {
                    this.isUserIdInUsed = true;
                    this.isEmailIdInUsed = true;
                    this.setUpError(res.message);
                }
                else {
                    this.isUserIdInUsed = false;
                    this.isEmailIdInUsed = false;
                    this.currentTabIndex = this.currentTabIndex + 1; //Moving to next tab
                }
            },
                error => {
                    this.setUpError(this.config.getConfig("userIdCheckError"));
                    this.isUserIdInUsed = true;
                    this.isEmailIdInUsed = true;
                });
        }
    }

    isControlContainError(control: any): boolean {
        let result: boolean = false;

        let error = control.errors != null ? control.errors.pattern : null;
        if (error == undefined || error == null)
            result = false;
        else
            result = true;

        return result;
    }

    setUpError(msg: string) {
        this.spinner.stop();
        this.errorMessage = msg;
        this.notification.popupSnackbar(msg);
    }

    markPolicyAsChanged() {
        this.isPolicyValid = false;
        this.errorMessage = "";
    }

    onAgreementAccepted(event) {
        this.isAgreementAccepted = event.checked;
    }

    onTermAndConditionClick(event) {
        this.isTermAndConditionClicked = true;
    }

    get isNextButtonEnable(): boolean {
        // Bots provide values for all form fields. Honeypot is a hidden field and if it has a value, 
        // assume it's a bot and don't enable the next button.
        if (this.personalInfoForm.controls["honeypot"].value) return false;

        let isEmailValid = Validation.emailReg.test(this.userInfoForm.controls.email.value);

        return (this.currentTabIndex == 0)
            || (this.currentTabIndex == 1 && this.personalInfoForm.valid && this.isCaptchaValid) 
            || (this.currentTabIndex == 2 && this.userInfoForm.valid && isEmailValid)
            || (this.currentTabIndex == 3 && this.securityInfoForm.valid && this.isAgreementAccepted && this.isTermAndConditionClicked && this.isCaptchaValid);
    }

    get isPersonalInfoTabEnable(): boolean {
        if ((!this.personalInfoForm.valid || !this.isPolicyValid) && this.currentTabIndex <= 0)
            return false;
        else
            return (this.currentTabIndex > 0) || this.personalInfoForm.valid && this.isPolicyValid;
    }

    get isUserIdInfoTabEnable(): boolean {
        return this.personalInfoForm.valid && this.isPolicyValid;
    }

    get isSecurityInfoTabEnable(): boolean {
        return this.isUserIdInfoTabEnable && this.userInfoForm.valid && !this.isUserIdInUsed && !this.isEmailIdInUsed && !this.isUserIdInUsed;
    }

    cancelRequest() {
        this.authService.logOut();
    }

    resolved(captchaResponse: string) {       
        this.captchaResponse = captchaResponse;
        this.isCaptchaValid = !this.showRecaptcha || captchaResponse !== null;
    }
}
