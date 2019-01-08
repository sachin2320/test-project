import { ColumnType } from "app/enums/column-type.enum";

export class KeyValueModel {
    constructor(public key: string,
        public value: any,
        public type: ColumnType = ColumnType.Text) {
    }
}