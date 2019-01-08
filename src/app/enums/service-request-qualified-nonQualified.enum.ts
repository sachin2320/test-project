export enum PartialSurrenderAmountType {
    PartialAmount = 1,
    MaximumAmount = 0
}
export enum PartialSurrenderAmountSelectionMode {
    GrossAmount = 1,
    NetAmount = 0
}
export enum SystematicWithdrawalType {
    InterestOnly = 1,
    SpecificDollarAmount = 2,
    GuaranteeMinimumWithdrawalBenefit = 3,
    EnhancedGuaranteedMinimumWithdrawalBenefit = 4
}
export enum SystematicWithdrawalAmountSelectionMode {
    GrossAmount = 1,
    NetAmount = 0
}
export enum PaymentFrequencyMode {
    Monthly = 1,
    Quarterly = 2,
    Semiannual = 3,
    Annual = 4
}
export enum PaymentStartDateType {
    Immediately = 1,
    Other = 0
}
export enum DistributionMethodTypeMode {
    Check = 1,
    ElectronicFundsTransfer = 0
}
export enum AccountType {
    Checking = 1,
    Savings = 0
}
export enum ReturnPolicyTypeMode {
    AgreeToReturnPolicy = 1,
    AgreeThatPolicyHasBeenLost = 0
}