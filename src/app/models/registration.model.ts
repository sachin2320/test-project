export class RegistrationModel {
    constructor(public isIndividual: boolean = true,
        public firstName: string = "",
        public lastName: string = "",
        public middleName: string = "",
        public taxId: string = "",
        public countryCode: string = "",
        public phone: string = "",
        public phoneExt: string = "",
        public zipCode: string = "",
        public policyNumber: string = "",
        public policyNickName: string = "",
        public email: string = "",
        public confirmEmail: string = "",
        public userName: string = "",
        public password: string = "",
        public confirmPassword: string = "",
        public securityQuestionId1: number = null,
        public securityQuestionId2: number = null,
        public securityQuestionId3: number = null,
        public answer1: string = "",
        public answer2: string = "",
        public answer3: string = "",
        public securityCustomQuestion1: string = "",
        public securityCustomQuestion2: string = "",
        public securityCustomQuestion3: string = "",
        public entityName: string = "",
        public recaptchaResponse: string = "") {
    }

    public get name() {
        if (this.isIndividual)
            return this.firstName + " " + (this.middleName == null ? "" : (this.middleName + " ")) + this.lastName;
        else
            return this.entityName;
    }
}