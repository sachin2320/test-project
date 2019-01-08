export class ServiceRequestTypeDocumentModel {
    constructor(public docTypeId: number = null,
        public docTypeName: string = '',
        public docContentType: string = '',
        public docId: number = null,
        public docName: string = '',
        public docDesc: string = '',
        public docCode: string = '',
        public isDocRequired: boolean = false,
        public isNYOnly: boolean = false,
        public docDisplayOrder: number = null,
        public docContentTypeDesc: string = '',
        public documentContent: any = null,
        public isActive: boolean = true,
        public isDownloadAllow: boolean = true,
        public isUploadAllow: boolean = true,
        public premiumMode: string = '') {
    }
}
