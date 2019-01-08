import { ServiceRequestFieldDetailModel } from "app/models/serviceRequestFieldDetail.model";
import { ServiceRequestDisclosureModel } from "app/models/serviceRequestDisclosure.model";
import { ServiceRequestDocumentModel } from "app/models/serviceRequestDoument.model";

export class ServiceRequestModel {
    constructor(public requestId: string = "",
        public requestXRefId: string = "",
        public requestTypeId: number = 0,
        public requestType: string = "",
        public requestStatusId: number = 0,
        public requestStatus: string = "",
        public requestSubject: string = "",
        public policyNumber: string = "",
        public serviceRequestHTML: string = "",
        public isOnline: boolean = false,
        public userComment: string = "",
        public subject: string = "",
        public requestDetails: ServiceRequestFieldDetailModel[] = [],
        public serviceDocuments: ServiceRequestDocumentModel[] = [],
        public requestDisclosure: ServiceRequestDisclosureModel[] = [],
        public serviceComments: any[] = [],
        public requestDetailXml: string = "",
        public userName: string = "",
        public ownerInitials: string = "",
        public ownerLast4Ssn: string = "",
        public ownerDob: Date = null,
        public isAgreementAccepted: boolean = false,
        public acceptedAgreementText: string = "",
        public firstName: string = "",
        public middleName: string = "",
        public lastName: string = "",
        public entityName: string = "",
        public phone: string = "",
        public email: string = "",
        public submittedIp: string = "",
        public submittedDate: Date = null,
        public lastUpdateDate: Date = null,
        public socialSecurityNumber: string = "") {
    }
}