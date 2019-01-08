export class PolicyGmwbStrategyModel {
    constructor(public interestCreditingMethod: string,
        public gmwbIncomeBase: number,
        public currentRates: string,
        public gauranteedRates: string,
        public upcomingRates: string) { }
}

