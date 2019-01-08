import { ColumnType } from "app/enums/column-type.enum";

export class GridDataModel {
    constructor(public value: any,
        public columnType: ColumnType,
        public cssClasses: string = "",
        public styles: string = "",
        public anchorUrl: string = "",
        public anchorClass: string = "",
        public params: string[] = [],
        public isAttachAnchorClickEvent: boolean = false,
        public columnName: string = "",
        public tooltipId: string = "",
    ) { }
}