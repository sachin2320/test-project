import { ServiceRequestDocumentModel } from "app/models/serviceRequestDoument.model";


export class ServiceRequestBodyModel {
    constructor(public requestTypeId: number = null,
        public isValidModel: boolean = false,
        public isAgreementAccepted: boolean = false,
        public policyNumber: string = "",
        public product: string = "",
        public productSubType: string = "",
        public tpa: number = null,
        public serviceDocuments: ServiceRequestDocumentModel[] = [],
        public modelData: any = {}) { }
}