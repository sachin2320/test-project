export class PolicyGmwbScheduleCreditModel {
    constructor(
        public gmwbStatus: string = "",
        public gmwbInitialRollUpRate: number = 0,
        public gmwbPayoutIncomeBase: number = 0,
        public gmwbPayoutFactor: number = 0,
        public gmwbStandardPayoutAmt: number = 0,
        public gmwbEnhancedPayoutAmt: number = 0,
        public gmwbEnhancedIncomeBase: number = 0,
        public gmwbPolicyYearAmountPaid: number = 0,
        public gmwbPolicyYearPayoutRemaining: number = 0,
        public isDisplayGMWBPayout: boolean = false,
        public isDisplayGMWBAccumulation: boolean = false) { }
}



