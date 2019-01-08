export class QuestionInfoModel {
    constructor(public id: string,
        public questionType: string,
        public questionDescription: string,
        public questionToolTip: string,
        public isActive: boolean,
        public isItOtherQuestion: boolean) {
    }
}