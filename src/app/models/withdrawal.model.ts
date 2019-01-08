export class WithdrawalModel {
    constructor(public grossWithdrawalYtdAmt: number,
        public netWithdrawalYtdAmt: number,
        public grossWithdrawalSinceInceptionAmt: number,
        public netWithdrawalSinceInceptionAmt: number) {

    };
}

