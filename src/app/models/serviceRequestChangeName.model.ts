import { KeyValueModel } from "app/models/keyValue.model";

export class ServiceRequestChangeNameModel {
    public columnOrders: KeyValueModel[] = [];

    public constructor(public formerFirstName: string = "",
        public formerLastName: string = "",
        public formerMiddleInitials: string = "",
        public newFirstName: string = "",
        public newLastName: string = "",
        public newMiddleInitials: string = "",
        public isInsured: boolean = false) {

        this.columnOrders.push(new KeyValueModel("formerFirstName", "1"));
        this.columnOrders.push(new KeyValueModel("formerMiddleInitials", "2"));
        this.columnOrders.push(new KeyValueModel("formerLastName", "3"));

        this.columnOrders.push(new KeyValueModel("newFirstName", "4"));
        this.columnOrders.push(new KeyValueModel("newMiddleInitials", "5"));
        this.columnOrders.push(new KeyValueModel("newLastName", "6"));

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