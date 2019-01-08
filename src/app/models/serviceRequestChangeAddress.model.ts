import { KeyValueModel } from "app/models/keyValue.model";

export class ServiceRequestChangeAddressModel {
    public columnOrders: KeyValueModel[] = [];

    public constructor(public formerFirstName: string = "",
        public lastName: string = "",
        public middleInitials: string = "",
        public firstName: string = "",
        public street: string = "",
        public country: string = "",
        public city: string = "",
        public state: string = "",
        public zip: string = "",
        public phone: string = "",
        public emailAddress: string = "",
        public isInsured: boolean = false) {

        this.columnOrders.push(new KeyValueModel("firstName", "1"));
        this.columnOrders.push(new KeyValueModel("middleInitials", "2"));
        this.columnOrders.push(new KeyValueModel("lastName", "3"));
        this.columnOrders.push(new KeyValueModel("address", "4"));
        this.columnOrders.push(new KeyValueModel("city", "5"));
        this.columnOrders.push(new KeyValueModel("state", "6"));
        this.columnOrders.push(new KeyValueModel("zip", "7"));
        this.columnOrders.push(new KeyValueModel("phone", "8"));
	// RB Version this.columnOrders.push(new KeyValueModel("email", "9"));
        this.columnOrders.push(new KeyValueModel("emailAddress", "9"));
        this.columnOrders.push(new KeyValueModel("country", "10"));
        this.columnOrders.push(new KeyValueModel("isInsured", "99999"));
    }

    public getDisplayOrder(columnName: string): number {
        let filter = this.columnOrders.filter(x => x.key == columnName);
        if (filter.length > 0)
            return Number(filter[0].value);
        else
            return -1;
    }
}

