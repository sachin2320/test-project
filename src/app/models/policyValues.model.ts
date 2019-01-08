import { LobType } from "app/enums/lob-type.enum";

export class PolicyValuesModel {
    constructor(
        public policyTypeId: LobType = LobType.Life,
        public accountValue: number = 0,
        public totalAccountValue: number = 0,
        public surrenderCharge: number = 0,
        public netSurrenderValue: number = 0,
        public penaltyFreeAmount: number = 0,
        public loanBalance: number = 0,
        public surrenderValue: number = 0,
        public faceAmount: number = 0,
        public deathBenefitOption: string = "",
        public deathBenefits: number = 0,
        public deathBenefitLumpSum: number = 0,
        public grossWithdrawalsSinceInception: number = 0,
        public requiredMinimumDistribution: number = 0,
        public nonVestedBonusAccountValue: number = 0,
        public marketValueAdjustment: number = 0,
        public mgsvAdjustment: number = 0) {
    }
}