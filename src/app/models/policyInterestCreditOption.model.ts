export class PolicyInterestCreditOptionModel {
    constructor(
        public option: string = "",
        public value: number = 0,
        public rate: number = 0,
        public associateIndex: string = "",
        public ticker: string = "",
        public creditingPeriod: string = "",
        public isOpen: boolean,
        public isCurrent: boolean
    ) { };
}

