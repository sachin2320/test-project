
import { Component, Input } from "@angular/core";
import { SecurityQuestionModel } from "app/models/securityQuestion.model";
import { QuestionInfoModel } from "app/models/questionInfo.model";
import { Validator, Validators } from "@angular/forms";
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'questionanswer',
    templateUrl: './questionAnswer.component.html'
})

export class QuestionAnswerComponent {
    @Input('formgroup') formGroupName: any = null;

    @Input('answerformcontrolname') answerFormControlName: string = "";
    @Input('answerplaceholder') answerPlaceHolder: string = "Answer";

    @Input('questions') securityQuestions: QuestionInfoModel = null;
    //@Input('customquestion') customQuestion: string = "";

    @Input('questionplaceholder') questionPlaceHolder: string = "";
    @Input('questionformcontrolname') questionFormControlName: string = "";

    @Input('customquestionplaceholder') customQuestionPlaceHolder: string = "";
    @Input('customquestionname') customQuestionFormControlName: string = "";



    onQuestionChange(questionValue) {
        let control = this.formGroupName.controls[this.customQuestionFormControlName];
        control.value = "";
        if (control != null && control != undefined) {
            if (questionValue == -1) {
                control.setValidators(Validation.ValidateRequiredWithNoEmptySpaceInput);
            }
            else {
                control.setValidators(null);
            }
            control.updateValueAndValidity();
        }
    }

    get isCustomQuestionSelected(): boolean {
        return this.formGroupName.controls[this.questionFormControlName].value == -1;
    }
}