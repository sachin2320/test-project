export class ServiceRequestDocumentModel {
    constructor(public requestId: number = null,
        public requestXRefId: number = null,
        public documentId: number = null,
        public name: string = "",
        public description: string = "",
        public documentTypeId: number = null,
        public documentContent: any = null,
        public documentContentType: string = "",
        public documentContentLength: number = null,
        public documentFileName: string = "",
        public displayOrder: number = null,
        public isSensitive: boolean = false,
        public isEncrypted: boolean = false,
        public logInUser: string = "",
        public createdOn: Date = null) {
    }
}
