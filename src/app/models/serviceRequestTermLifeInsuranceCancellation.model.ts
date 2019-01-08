import { KeyValueModel } from "app/models/keyValue.model";

export class ServiceRequestTermLifeInsuranceCancellationModel {
    public columnOrders: KeyValueModel[] = [];

    public constructor(
        public isCancellationImmediate: boolean = false,
        public effectiveDate: Date = null) {
        this.columnOrders.push(new KeyValueModel("isCancellationImmediate", "1"));
        this.columnOrders.push(new KeyValueModel("effectiveDate", "2"));
    }

    public getDisplayOrder(columnName: string): number {
        let filter = this.columnOrders.filter(x => x.key == columnName);
        if (filter.length > 0)
            return Number(filter[0].value);
        else
            return -1;
    }
}