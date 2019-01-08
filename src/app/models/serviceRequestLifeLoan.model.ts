import { KeyValueModel } from "app/models/keyValue.model";

export class ServiceRequestLifeLoanModel{
    public columnOrders: KeyValueModel[] = [];
    
        public constructor(
            public isAddressSame: boolean = true,
            public country: string = "",
            public street: string = "",
            public city: string = "",
            public state: string = "",
            public zipCode: string = "",
            public isLoanDeliveryStandard: boolean = true,
            public carrier: string = "",
            public accountNumber: string = "",
            public isLoanAmountRequestMaximum: boolean = true,
            public specificLoanAmount: string = "",
            public isLoanTypeFixed: boolean = true,
            public incomeTaxWithhold: boolean = true,
            public withholdFederalIncomeTax: string = "",
            public withholdStateIncomeTax: string = "",
            public residenceState: string = "",
            public ownersAddress: string = "",
            public loanDeliveryType: string = "",
            public loanAmountRequest: string = "",
            public loanType: string = ""
            
        ) {
            this.columnOrders.push(new KeyValueModel("isAddressSame", "1"));
            this.columnOrders.push(new KeyValueModel("country", "2"));
            this.columnOrders.push(new KeyValueModel("street", "3"));
            this.columnOrders.push(new KeyValueModel("city", "4"));
            this.columnOrders.push(new KeyValueModel("state", "5"));
            this.columnOrders.push(new KeyValueModel("zipCode", "6"));
            this.columnOrders.push(new KeyValueModel("isLoanDeliveryStandard", "7"));
            this.columnOrders.push(new KeyValueModel("carrier", "8"));
            this.columnOrders.push(new KeyValueModel("accountNumber", "9"));
            this.columnOrders.push(new KeyValueModel("isLoanAmountRequestMaximum", "10"));
            this.columnOrders.push(new KeyValueModel("specificLoanAmount", "11"));
            this.columnOrders.push(new KeyValueModel("isLoanTypeFixed", "12"));
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