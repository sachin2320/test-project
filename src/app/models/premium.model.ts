export class PolicyPremiumModel {
    constructor(public plannedPremium: number = 0,
        public paymentMode: string = "",
        public nextDraftDate: Date = null,
        public monthlyNoLapsePremium: number = 0,
        public commTargetPremium: number = 0,
        public premiumPainYTD: number = 0,
        public premiumPaidPriorYear: number = 0,
        public premiumPaidSinceInception: number = 0,
        public draftDay: string = "",
        public bankRoutingNumber: string = "",
        public bankAccountNumber: string = "",
        public productSubType: string = "",
        public policyNumber: string = "",
        public policyOwnerCount: number = 0) {
    }
}


