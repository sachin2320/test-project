export class PolicyRmdModel {
    constructor(public requiredAmount: Number = null,
        public takenAmount: Number = null,
        public remainingAmount: Number = null,
        public policyOwnerCount: Number = 0,
        public policyNumber: string = "",
        public lastDistributionDate: Date = null,
        public nextDistributionDate: Date = null) { };
}
