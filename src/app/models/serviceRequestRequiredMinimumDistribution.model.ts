import { AccountType } from "app/enums/account-type.enum";
import { DistributedElectionType } from "app/enums/distributed-election-type.enum";
import { KeyValueModel } from "app/models/keyValue.model";
import { NoElectionType } from "app/enums/election-type.enum";
import { PaymentOption } from "app/enums/payment-option.enum";
import { PaymentType } from "app/enums/payment-type.enum";
import { ServiceRequestDocumentModel } from "app/models/serviceRequestDoument.model";

export class ServiceRequestRequiredMinimumDistributionModel {
    public columnOrders: KeyValueModel[] = [];

    public constructor(
        public noElectionType: NoElectionType = null,
        public distributedElectionType: DistributedElectionType = null,
        public paymentOption: PaymentOption = null,
        public ownCalculationDollarAmt: number = null,
        public jointLifeExpectancyDob: Date = null,
        public fairMarketValue: number = null,      
        public paymentType: PaymentType = null,
        public accountType: AccountType = null,
        public accountBankName: string = '',
        public accountTelephoneNumber: string = '',
        public accountNumber: string = '',
        public accountBankRoutingNumber: string = '',
        public incomeTaxWithhold: string = '',
        public withholdFederalIncomeTax: string = "",
        public withholdStateIncomeTax: string = "",
        public residenceState: string = "",
        public currenySignFederal: string = "",
        public currenySignState: string = "",
        
        public requestDocument: ServiceRequestDocumentModel = null) {
        this.columnOrders.push(new KeyValueModel("noElectionType", "1"));
        this.columnOrders.push(new KeyValueModel("distributedElectionType", "2"));
        this.columnOrders.push(new KeyValueModel("paymentOption", "3"));
        this.columnOrders.push(new KeyValueModel("ownCalculationDollarAmt", "4"));
        this.columnOrders.push(new KeyValueModel("jointLifeExpectancyDob", "5"));
        this.columnOrders.push(new KeyValueModel("fairMarketValue", "6"));
        this.columnOrders.push(new KeyValueModel("paymentType", "7"));
        this.columnOrders.push(new KeyValueModel("accountType", "8"));
        this.columnOrders.push(new KeyValueModel("accountBankName", "9"));
        this.columnOrders.push(new KeyValueModel("accountTelephoneNumber", "10"));
        this.columnOrders.push(new KeyValueModel("accountNumber", "11"));
        this.columnOrders.push(new KeyValueModel("accountBankRoutingNumber", "12"));        
        this.columnOrders.push(new KeyValueModel("incomeTaxWithhold", "13"));
        this.columnOrders.push(new KeyValueModel("withholdFederalIncomeTax", "14"));
        this.columnOrders.push(new KeyValueModel("withholdStateIncomeTax", "15"));
        this.columnOrders.push(new KeyValueModel("residenceState", "16"));
    }

    public getDisplayOrder(columnName: string): number {
        let filter = this.columnOrders.filter(x => x.key == columnName);
        if (filter.length > 0)
            return Number(filter[0].value);
        else
            return -1;
    }
}