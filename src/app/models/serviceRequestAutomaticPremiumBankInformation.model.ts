import { KeyValueModel } from "app/models/keyValue.model";

export class ServiceRequestAutomaticPremiumBankInformationModel {
    public columnOrders: KeyValueModel[] = [];

    public constructor
        (
        public payorFirstName: string = "",
        public payorLastName: string = "",
        public payorMiddleInitials: string = "",
        public financialInstitutionName: string = "",
        public isAccountTypeCheckings: boolean = false,
        public routingNumber: string = "",
        public accountNumber: string = "",
        public confirmAccountNumber: string = "",
        public confirmRoutingNumber: string = "",
        public isPayorDifferent: boolean = false,
        public payorName: string = "",
        public isPayorDifferentThanPolicyOwner: string = "",
        public accountType: string = ""
        ) {
        this.columnOrders.push(new KeyValueModel("financialInstitutionName", "1"));  
        this.columnOrders.push(new KeyValueModel("payorName", "2"));     
        this.columnOrders.push(new KeyValueModel("routingNumber", "3"));
        this.columnOrders.push(new KeyValueModel("accountNumber", "4"));
        this.columnOrders.push(new KeyValueModel("confirmRoutingNumber", "5"));
        this.columnOrders.push(new KeyValueModel("confirmAccountNumber", "6")); 
        this.columnOrders.push(new KeyValueModel("accountType", "7"));
        this.columnOrders.push(new KeyValueModel("isPayorDifferentThanPolicyOwner", "8"));  
    }

    public getDisplayOrder(columnName: string): number {
        let filter = this.columnOrders.filter(x => x.key == columnName);
        if (filter.length > 0)
            return Number(filter[0].value);
        else
            return -1;
    }
}

