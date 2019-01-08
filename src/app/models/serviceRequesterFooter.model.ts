
import { ServiceRequestDisclosureModel } from "app/models/serviceRequestDisclosure.model";

export class ServiceRequestFooterModel {
    constructor(public ownerInitials: string = "",
        public ownerDob: Date = null,
        public last4DigitSsn: string = "",
        public agreementText: string = "",
        public isAgreementAccepted: boolean = false,
        public authorizationChkBoxItems: ServiceRequestDisclosureModel[] = []) {
    }
}