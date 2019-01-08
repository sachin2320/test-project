import { QuestionInfoModel } from "app/models/questionInfo.model";

export class SecurityQuestionModel {
    constructor(public securityQuestion1: QuestionInfoModel[],
        public securityQuestion2: QuestionInfoModel[],
        public securityQuestion3: QuestionInfoModel[]) {
    }
}