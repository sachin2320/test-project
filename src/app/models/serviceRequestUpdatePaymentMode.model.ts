import { KeyValueModel } from "app/models/keyValue.model";
import { PaymentModes, PremiumTypes, IsPayorDifferentThanPolicyOwner, AccountTypes } from "app/enums/service-request-change-payment-mode.enum";

export class ServiceRequestUpdatePaymentModeModel {
    public columnOrders: KeyValueModel[] = [];

    public constructor(
        public paymentMode: PaymentModes = null,
        public premiumType: PremiumTypes = null,
        public premiumPlanned: string = "",
        public accountNumber: string = "",
        public confirmAccountNumber: string = "",
        public routingNumber: string = "",
        public confirmRoutingNumber: string = "",
        public isPayorDifferentThanPolicyOwner: IsPayorDifferentThanPolicyOwner = null,
        public accountType: AccountTypes = null,
        public isBankingInformationChanged: boolean = true,
        public payorFirstName: string = "",
        public payorMiddleInitials: string = "",
        public payorLastName: string = "",
        public financialInstitutionName: string = "") {
        this.columnOrders.push(new KeyValueModel("paymentMode", "1"));
        this.columnOrders.push(new KeyValueModel("premiumPlanned", "2"));
        this.columnOrders.push(new KeyValueModel("premiumType", "3"));
        this.columnOrders.push(new KeyValueModel("isPayorDifferent", "3"));
    }

    public getDisplayOrder(columnName: string): number {
        let filter = this.columnOrders.filter(x => x.key == columnName);
        if (filter.length > 0)
            return Number(filter[0].value);
        else
            return -1;
    }
}