import { PolicyBeneficiaryModel } from "app/models/policyBeneficiary.model";

export class PolicyDeathBenefitModel {
    constructor(
        public deathBenefits: Number = 0,
        public deathBenefitPayout: Number = 0,
        public deathBenefitLumpSum: Number = 0,
        public primaryBeneficiaries: PolicyBeneficiaryModel[] = [],
        public policyOwnerCount: Number = 0,
        public policyNumber: string = "",
        public contingentBeneficiaries: PolicyBeneficiaryModel[] = []) { }
}



