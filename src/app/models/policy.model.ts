import { PolicyAdditionalCoverageModel } from "app/models/policyAdditionalCoverage.model";
import { PolicyBeneficiaryModel } from "app/models/policyBeneficiary.model";
import { PolicyInterestCreditOptionModel } from "app/models/policyInterestCreditOption.model";
import { LobType } from "app/enums/lob-type.enum";


export class PolicyModel {

    constructor() { }

    public lineOfBusiness: LobType;
    public policyNumber: string;
    public tpaId: number;
    public companyCode: string;
    public adminStatusId: number;
    public adminStatusLastChangedDate: Date;
    public policyType: string;
    public policyTypeId: number;
    public contractIssuedDate: Date;
    public issueStateCode: string;
    public issueStateName: string;
    public planCodeId: number;
    public planCode: string;
    public productId: number;
    public productCode: string;
    public productName: string;
    public productSubTypeName: string;
    public productTypeName: string;
    public statusCode: string;
    public statusCategory: string;
    public businessDesc: string;
    public statusDesc: string;
    public insuredSmokerCode: string;
    public insuredSmokerCodeDescription: string;
    public accountValue: number;
    public surrenderCharge: number;
    public marketValueAdjustment: number;
    public netSurrenderValue: number;
    public penaltyFreeAmount: number;
    public deathBenefits: number;
    public deathBenefitOption: string;
    public deathBenefitLumpSum: number;
    public mgsvAdjustment: number;
    public grossDepositsPriorYear: number;
    public grossDepositsYTD: number;
    public grossDepositsSinceInception: number;
    public grossWithdrawalsYTD: number;
    public grossWithdrawalsPriorYear: number;
    public grossWithdrawalsSinceInception: number;
    public netWithdrawalsPriorYear: number;
    public netWithdrawalsYTD: number;
    public netWithdrawalsSinceInception: number;
    public loan: number;
    public maxLoan: number;
    public loanInterestRate: number;
    public commTargetPremium: number;
    public faceAmount: number;
    public interestCreditingOptions: PolicyInterestCreditOptionModel[] = [];
    public coverages: PolicyAdditionalCoverageModel[] = [];

    public primaryBeneficiaries: PolicyBeneficiaryModel[] = [];
    public contingentBeneficiaries: PolicyBeneficiaryModel[] = [];

    public requiredMinimumDistribution: number;
    public nonVestedBonusAccountValue: number;
    public plannedPremium: number;
    public paymentMode: string;
    public nextDraftDate: Date;
    public monthlyNoLapsePremium: number;
    public premiumPainYTD: number;
    public premiumPaidPriorYear: number;
    public premiumPaidSinceInception: number;

    public agentName: string;
    public insuredName: string;
    public ownerName: string;
    public annuitantName: string;
    public ownerFirstName: string;
    public ownerLastName: string;
    public ownerEntityName: string;
    public ownerEmail: string;
    public ownerPhone: string;
    public ownerCount: number;
    public corporationInd: boolean;

    public gmwbStatus: string;
    public gmwbInitialRollUpRate: number;
    public gmwbPayoutIncomeBase: number;
    public gmwbPayoutFactor: number;
    public gmwbStandardPayoutAmt: number;
    public gmwbEnhancedIncomeBase: number;
    public gmwbPolicyYearAmountPaid: number;
    public gmwbPolicyYearPayoutRemaining: number;
    public gmwbEnhancedPayoutAmt: number;

    public bankRoutingNumber: string;
    public bankAccountNumber: string;
    public draftDay: string;
    public requiredMinimumDistributionCalculated: Number;
    public requiredMinimumDistributionTaken: Number;
    public requiredMinimumDistributionRemaining: Number;
    public annuitizationDeathBenefitValue: Number;

    public isDisplayGMWB: boolean = false;
    public isDisplayGMWBPayout: boolean = false;
    public isDisplayGMWBAccumulation: boolean = false;
    public canPolicyDetailView: boolean = false;

    public combinedOwnerName: string = "";
    public combinedAnnuitantName: string = "";
    public combinedInsuredName: string = "";
   
    public totalAccountValue: number;
    public isDisplayRMD: boolean = false;
    public hasVestingBonus: boolean = false;
    public hasEnhancedDeathBenefitPayout: boolean = false;
    public hasPartialIndexCreditOnSurrender: boolean = false;

    public asofDate: Date;
    public tooltipId: string;
}