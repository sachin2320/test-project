import { SecurityQuestionModel } from 'app/models/securityQuestion.model';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Validation } from 'app/shared-services/validation.service';
import { CommonService } from 'app/shared-services/common.service';
import { SpinnerService } from 'app/shared-services/spinner.service';
import { AppConfig } from 'app/configuration/app.config';
import { SnackbarService } from 'app/shared-services/snackbar.service';
import { RouterModule } from '@angular/router';
import { UserPermissionKey } from 'app/enums/user-permission-key.enum';
import { UtilityService } from 'app/services/helper/utility.service';

@Component({
    selector: 'change-securityquestions',
    templateUrl: './change-securityquestions.component.html'
})

export class ChangeSecurityQuestionsComponent implements OnInit {
    securityInfoForm: any = {};
    errorMessage: string = '';
    securityQuestion: SecurityQuestionModel = null;
    isSecurityQuestionsChanged: boolean = false;
    answerId1: string='';
    answerId2: string='';
    answerId3: string='';
    constructor(
        private formBuilder: FormBuilder,
        private spinner: SpinnerService,
        private commonService: CommonService,
        public config: AppConfig,
        private notification: SnackbarService,
        private utilityService: UtilityService
    ) {
        this.securityQuestion = new SecurityQuestionModel([], [], []);
        this.setupFormFields();
    }

    ngOnInit() {
        this.spinner.start();
        this.setupQuestion();

        //If simulated user has no permission to change security questions, display error message to user 
        if(!this.utilityService.isSimulatedUserHasPermission(UserPermissionKey.perm_update_security_question_key))
            this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');
    }

    setupFormFields() {

        this.setupQuestionInfoFields('', '', '', '', '', '', '', '', '');
    }
    ngAfterViewChecked(){
        $(".padding-left-security").css("padding-left","17px");
    }
    setupQuestionInfoFields(qid1: string, qid2: string, qid3: string, customq1: string, customq2: string, customq3: string, ans1: string, ans2: string, ans3: string) {
        this.securityInfoForm = this.formBuilder.group({
            securityQuestionId1: [qid1, Validation.ValidateRequiredWithNoEmptySpaceInput],
            customQuestion1: [customq1],
            securityQuestionId2: [qid2, Validation.ValidateRequiredWithNoEmptySpaceInput],
            customQuestion2: [customq2],
            securityQuestionId3: [qid3, Validation.ValidateRequiredWithNoEmptySpaceInput],
            customQuestion3: [customq3],
            answer1: [ans1, Validation.ValidateRequiredWithNoEmptySpaceInput],
            answer2: [ans2, Validation.ValidateRequiredWithNoEmptySpaceInput],
            answer3: [ans3, Validation.ValidateRequiredWithNoEmptySpaceInput]
        });
    }

    setupQuestion(isDisplayError: boolean = false) {

        
        this.spinner.start();
        this.commonService.getSecurityQuestion().subscribe((res) => {
            this.spinner.stop();
            this.securityQuestion = res;
            this.commonService.getUserSecurityAnswers().subscribe( (ansRes)=>
        {
            this.bindSecurityQuestions(ansRes);
            this.spinner.stop();
        });
        },
            (error) => {
                if (isDisplayError) {
                    this.setUpError(this.config.getConfig('security_question_fetch_err'));
                    this.spinner.stop();
                }
            });
    }

    bindSecurityQuestions(ansRes: any){
        if(ansRes && ansRes.length>0) {
            ansRes.sort(function (item,nextitem){
                return item.displayOrder-nextitem.displayOrder;
            });
            
        } 
       this.answerId1=ansRes[0].id;
       this.answerId2=ansRes[1].id;
       this.answerId3=ansRes[2].id;
        this.setupQuestionInfoFields(ansRes[0].questionId.toString(), ansRes[1].questionId.toString(), ansRes[2].questionId.toString(), ansRes[0].customQuestion, ansRes[1].customQuestion, ansRes[2].customQuestion, ansRes[0].answer, ansRes[1].answer, ansRes[2].answer);
       if(ansRes[0].questionId == -1){
       this.securityInfoForm.controls.customQuestion1.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
       }
       if(ansRes[1].questionId == -1){
     this.securityInfoForm.controls.customQuestion2.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
    }
    if(ansRes[2].questionId == -1){
     this.securityInfoForm.controls.customQuestion3.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
    }
       
    }
    
    
    checkSecurityCustomQuestionsAndAnswersNotMatch(valuesToMatch) {
        valuesToMatch = valuesToMatch.concat(
            this.securityQuestion.securityQuestion1.map((x) => x.questionDescription),
            this.securityQuestion.securityQuestion2.map((x) => x.questionDescription).filter((x) => x !== "Create your own custom question"),
            this.securityQuestion.securityQuestion3.map(x => x.questionDescription).filter(x => x != "Create your own custom question"));
        var matchedValues = [];
        var isMatchingSecurityInfo = false;
        for (var i = 0; i < valuesToMatch.length; i++) {
            if (valuesToMatch[i]) {
                if (matchedValues[valuesToMatch[i].trim()] === undefined) {
                    matchedValues[valuesToMatch[i].trim()] = 1;
                }
                else {
                    isMatchingSecurityInfo = true;
                }
            }
        }
        return isMatchingSecurityInfo;
    }

    submit() {
        //If simulated user has no permission to change security questions, display error message to user 
        //otherwise allow user to change security questions.
        if(!this.utilityService.isSimulatedUserHasPermission(UserPermissionKey.perm_update_security_question_key))
        {
            this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');
            return false;
        }

        //Change security questions
        let data: any = {};
        Object.assign(data, this.securityInfoForm.value);

        let questionModel = {
            securityQuestionId1: data.securityQuestionId1,
            securityQuestionId2: data.securityQuestionId2,
            securityQuestionId3: data.securityQuestionId3,
            answer1: data.answer1,
            answer2: data.answer2,
            answer3: data.answer3,
            securityCustomQuestion1: data.customQuestion1,
            securityCustomQuestion2: data.customQuestion2,
            securityCustomQuestion3: data.customQuestion3,
            securityAnswerId1:this.answerId1,
            securityAnswerId2:this.answerId2,
            securityAnswerId3:this.answerId3,
        }

        let valuesToMatch: any = [questionModel.answer1, questionModel.answer2, questionModel.answer3,
        questionModel.securityCustomQuestion1, questionModel.securityCustomQuestion2,
        questionModel.securityCustomQuestion3];
        let isMatchingSecurityInfo = this.checkSecurityCustomQuestionsAndAnswersNotMatch(valuesToMatch);

        if (!isMatchingSecurityInfo) {
           
             this.commonService.updateUserSecurityQuestions(questionModel).subscribe((res)=>{
                    this.spinner.stop();
                    this.isSecurityQuestionsChanged = true;
             });
        }
        else {
            this.setUpError(this.config.getConfig("security_cutomquestion_answer_match_err"));
        }
    }
    setUpError(msg: string) {
        this.spinner.stop();
        this.errorMessage = msg;
        this.notification.popupSnackbar(msg);
    }
}