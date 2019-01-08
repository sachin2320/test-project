import { Component, Input } from "@angular/core";
import { SecurityQuestionModel } from "app/models/securityQuestion.model";

@Component({
    selector: 'user-securityinfo',
    styles: [],
    templateUrl: './securityInfo.component.html'
})

export class SecurityInfoComponent {
    @Input('securityinfoform') securityInfoForm: any = {};
    @Input('questions') securityQuestion: SecurityQuestionModel = null;
    @Input('securityInfoErrorMessage') securityInfoErrorMessage: string = "";
}