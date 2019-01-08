import { KeyValueModel } from "app/models/keyValue.model";

export class ServiceRequestLifeDisbursementModel {
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
        public surrenderType: string = "",
        public partialSurrenderType: string = "",
        public isMaximumPartialSurrender: boolean = true,
        public partialSurrenderAmount: string = "",
        public isGrossAmountForPartialSurrender: boolean = true,
        public isAgreeForFullSurrenderCharges: boolean = false,
        public isAgreeToOptOutOfAssetAccount: boolean = false,
        public isAgreeToReturnPolicyByEmail: boolean = true,
        public isPolicyOrInterestTransferred: boolean = true,

        public nameOfAssignee: string = "",
        public dateOfAssignment: string = "",
        public isAbsoluteAssignmentType: boolean = true,

        public incomeTaxWithhold: string = "",
        public withholdFederalIncomeTax: string = "",
        public withholdStateIncomeTax: string = "",
        public residenceState: string = "",

        public ownerAddress: string = "",
        public deliveryMethod: string = "",
        public selectedPartialSurrenderAmount: string = "",
        public selectedPartialSurrenderAmountType: string = "",
        public returnPolicyType: string = "",
        public agreeToSurrenderCharges: string = "",
        public agreeToOptOutOfAssetAccount: string = "",
        public assignmentType: string = ""
    ) {
        this.columnOrders.push(new KeyValueModel("ownerAddress", "1"));
        this.columnOrders.push(new KeyValueModel("country", "2"));
        this.columnOrders.push(new KeyValueModel("street", "3"));
        this.columnOrders.push(new KeyValueModel("city", "4"));
        this.columnOrders.push(new KeyValueModel("state", "5"));
        this.columnOrders.push(new KeyValueModel("zipCode", "6"));
        this.columnOrders.push(new KeyValueModel("deliveryMethod", "7"));
        this.columnOrders.push(new KeyValueModel("carrier", "8"));
        this.columnOrders.push(new KeyValueModel("accountNumber", "9"));
        this.columnOrders.push(new KeyValueModel("surrenderType", "10"));
        this.columnOrders.push(new KeyValueModel("selectedPartialSurrenderAmount", "11"));
        this.columnOrders.push(new KeyValueModel("partialSurrenderAmount", "12"));
        this.columnOrders.push(new KeyValueModel("selectedPartialSurrenderAmountType", "13"));

        this.columnOrders.push(new KeyValueModel("agreeToSurrenderCharges", "14"));
        this.columnOrders.push(new KeyValueModel("agreeToOptOutOfAssetAccount", "15"));
        this.columnOrders.push(new KeyValueModel("returnPolicyType", "16"));
        this.columnOrders.push(new KeyValueModel("isPolicyOrInterestTransferred", "17"));

        this.columnOrders.push(new KeyValueModel("nameOfAssignee", "18"));
        this.columnOrders.push(new KeyValueModel("dateOfAssignment", "19"));
        this.columnOrders.push(new KeyValueModel("assignmentType", "20"));

        this.columnOrders.push(new KeyValueModel("incomeTaxWithhold", "21"));
        this.columnOrders.push(new KeyValueModel("withholdFederalIncomeTax", "22"));
        this.columnOrders.push(new KeyValueModel("withholdStateIncomeTax", "23"));
        this.columnOrders.push(new KeyValueModel("residenceState", "24"));
    }

    public getDisplayOrder(columnName: string): number {
        let filter = this.columnOrders.filter(x => x.key == columnName);
        if (filter.length > 0)
            return Number(filter[0].value);
        else
            return -1;
    }
}