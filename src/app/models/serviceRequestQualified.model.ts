import { KeyValueModel } from "app/models/keyValue.model";

export class ServiceRequestQualifiedDisbursementSystematicWithdrawalModel {
    public columnOrders: KeyValueModel[] = [];

    public constructor(
        public premiumType: string = "",       
        public partialSurrenderType: boolean = true,    
        public partialSurrenderAmount: number = null,         
        public isGrossAmountForPartialSurrender: boolean = true,     
        public isSurrenderChargesAgreed: boolean = null,
        public isReturnPolicyAgreed: boolean = true,    
        public systematicWithdrawalType: boolean = true,    
        public isGrossAmountForSystematicSurrender: boolean = true,       
        public isDistributionMethodCheck: boolean = true,        
        public isAccountTypeCheckings: boolean = true,
        public accountNumber: string = "",
        public confirmAccountNumber: string = "",
        public routingNumber: string = "",
        public confirmRoutingNumber: string = "",       
        public incomeTaxWithhold: string = "",
        public withholdFederalIncomeTax: string = "",
        public withholdStateIncomeTax: string = "",
        public residenceState: string = "",
        public withdrawalType: string = "",
        public currencySignFederal: string = "",
        public currencySignState: string = "",            
        public paymentFrequencyMode: string = "",       
        public paymentEndDate: string = "",
        public paymentStartDate: string = "",
        public paymentStartDateMode:string = "",       
        public specificDollarAmount: string = "",
        public selectedPartialSurrenderAmount: string = "",      
        public selectedSystematicWithdrawalType: string = "",
        public selectedPartialSurrenderAmountType: string = "", 
        public selectedSystematicWithdrawalAmountType: string = "",
        public selectedPaymentFrequencyMode: string = "",        
        public agreeToSurrenderCharges: string = "",  
        public accountType : string = "",   
        public returnPolicyType: string = "",  
        public distributionMethodType : string = ""   
    ) {
        this.columnOrders.push(new KeyValueModel("withdrawalType", "1"));
        this.columnOrders.push(new KeyValueModel("selectedPartialSurrenderAmount", "2"));        
        this.columnOrders.push(new KeyValueModel("selectedPartialSurrenderAmountType", "3"));     
        this.columnOrders.push(new KeyValueModel("agreeToSurrenderCharges", "4"));
        this.columnOrders.push(new KeyValueModel("returnPolicyType", "5"));
        this.columnOrders.push(new KeyValueModel("selectedSystematicWithdrawalAmountType", "6"));
        this.columnOrders.push(new KeyValueModel("selectedPaymentFrequencyMode", "7"));
        this.columnOrders.push(new KeyValueModel("paymentStartDate", "8"));
        this.columnOrders.push(new KeyValueModel("paymentEndDate", "9"));
        this.columnOrders.push(new KeyValueModel("distributionMethodType", "10"));
        this.columnOrders.push(new KeyValueModel("accountType", "11"));
        this.columnOrders.push(new KeyValueModel("accountNumber", "12"));
        this.columnOrders.push(new KeyValueModel("confirmAccountNumber", "13"));
        this.columnOrders.push(new KeyValueModel("routingNumber", "14"));
        this.columnOrders.push(new KeyValueModel("confirmRoutingNumber", "15"));
        this.columnOrders.push(new KeyValueModel("specificDollarAmount", "16"));
        this.columnOrders.push(new KeyValueModel("incomeTaxWithhold", "17"));
        this.columnOrders.push(new KeyValueModel("withholdFederalIncomeTax", "18"));
        this.columnOrders.push(new KeyValueModel("withholdStateIncomeTax", "19"));
        this.columnOrders.push(new KeyValueModel("residenceState", "20"));        

    }

    public getDisplayOrder(columnName: string): number {
        let filter = this.columnOrders.filter(x => x.key == columnName);
        if (filter.length > 0)
            return Number(filter[0].value);
        else
            return -1;
    }
}