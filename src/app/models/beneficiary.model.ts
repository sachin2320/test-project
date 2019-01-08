import { KeyValueModel } from "app/models/keyValue.model";

export class Beneficiary {

    public constructor(public firstName: string = "",
        public lastName: string = "",
        public initials: string = "",
        public relationship: string = "",
        public benefit: number = 0,
        public country: string = "",
        public address: string = "",
        public city: string = "",
        public state: string = "",
        public zipCode: string = "",
        public ssn: string = "",
        public dob: Date = null,
        public phone: string = "",
        public emailAddress: string = "",
        public isIndividual: boolean = true,
        public trustName: string = "",
        public isInsured: boolean = false,
        public willDefaultValidationApply: boolean = false,
        public beneficiaryType: string = "",
        public relationshipTo: string = "",
    ) { }

    public getDisplayOrder(columnName: string): number {
        let columnOrders: KeyValueModel[] = this.getDisplayOrderCollection();
        let filter = columnOrders.filter(x => x.key == columnName);
        if (filter.length > 0)
            return Number(filter[0].value);
        else
            return -1;
    }

    private getDisplayOrderCollection(): KeyValueModel[] {
        let columnOrders: KeyValueModel[] = [];
        //Body
        columnOrders.push(new KeyValueModel("trustName", "1"));
        columnOrders.push(new KeyValueModel("firstName", "1"));
        columnOrders.push(new KeyValueModel("initials", "2"));
        columnOrders.push(new KeyValueModel("lastName", "3"));
        columnOrders.push(new KeyValueModel("benefit", "4"));
        columnOrders.push(new KeyValueModel("isInsured", "5"));
        columnOrders.push(new KeyValueModel("relationship", "6"));
        columnOrders.push(new KeyValueModel("country", "7"));
        columnOrders.push(new KeyValueModel("address", "8"));
        columnOrders.push(new KeyValueModel("city", "9"));
        columnOrders.push(new KeyValueModel("state", "10"));
        columnOrders.push(new KeyValueModel("zipCode", "11"));
        columnOrders.push(new KeyValueModel("ssn", "12"));
        columnOrders.push(new KeyValueModel("dob", "13"));
        columnOrders.push(new KeyValueModel("phone", "14"));
        columnOrders.push(new KeyValueModel("emailAddress", "15"));
        columnOrders.push(new KeyValueModel("isIndividual", "99999"));
        columnOrders.push(new KeyValueModel("willDefaultValidationApply", "99999"));
        columnOrders.push(new KeyValueModel("beneficiaryType", "16"));
        columnOrders.push(new KeyValueModel("relationshipTo", "17"));

        // Footer
        // TODO: Move to Footer Model
        columnOrders.push(new KeyValueModel("ownerInitials", "1"));
        columnOrders.push(new KeyValueModel("ownerDob", "2"));
        columnOrders.push(new KeyValueModel("last4DigitSsn", "3"));
        columnOrders.push(new KeyValueModel("isAgreementAccepted", "4"));

        return columnOrders;
    }
}