import { PolicyModel } from "app/models/policy.model";
import { ServiceRequestModel } from "app/models/serviceRequest.model";


export class PolicyListModel {
    constructor(public annuityPolicies: PolicyModel[] = [],
        public lifePolicies: PolicyModel[] = [],
        public openServiceRequests: ServiceRequestModel[]) {
    }
}