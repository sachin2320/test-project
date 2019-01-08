export enum ServiceRequestType {
    None=0,
    ChangeBeneficiary=1,
    ChangeName=2,
    ChangeMailingAddress=3,
    TermLifeInsuranceCancellation=4,    
    RequestPartialOrFullSurrender = 5,
    RequestFundReallocation = 6,
    RequestRequiredMinimumDistribution = 7,
    InterestCreditingReallocation = 8,
    ChangeAutomationPremiumBankInformation = 9,
    DisbursementLifeInsurance = 10,
    LifeLoan = 11,
    DuplicateLifeInsurancePolicy = 12,
    ChangePaymentMode = 13,
    ContactUs=14,
    ChangePhone=15,
    QualifiedDisbursementSystematicWithdrawl=16,
    NonQualifiedDisbursementSystematicWithdrawl=17,
    InterestCreditingReallocationFIA = 19
}