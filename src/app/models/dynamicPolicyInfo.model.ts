import { ColumnType } from "app/enums/column-type.enum";
import { ServiceRequestType } from "app/enums/service-type.enum";   // MJD

export class DynamicPolicyInfoModel {
    public type: PolicyType;
    public name: string;
    public dynamicFields: DynamicField[];
    public policyTabs: PolicyTab[];
    public asofDate: Date;
    public assistanceText: string;
    public isPolicyDetailCanBeView: boolean = false;
    public policyTypeId?: number;
    public policyNumber: string;
}

export class DynamicField {
    public key: string;
    public displayLabel: string;
    public displayValue: string;
    public tooltipText: string;
    public columnNumber: number;
    public order?: number;
    public dataType: ColumnType;
    public displayValueCss: string;
    public displayLabelCss: string;
    public tableOrder: number;
    public tableAlignment: TableAlignment;
    public displayLabelAlign: TextAlign;
    public displayValueAlign: TextAlign;
}

export class FieldPropertyModel {
    constructor(public key: string,
        public value: any,
        public type: ColumnType = ColumnType.Text,
        public tooltipText: string = '',
        public textAlign: string,
        public valueAlign: string
    ) {
    }
}

export class PolicyTab {
    public name: string;
    public order: number;
    public footerText: string;  // MJD
    public policyTabButtons: PolicyTabButton[]; // MJD
    public policyTabBaseTable: PolicyTabBaseTable;
    public policyTabRootTable: PolicyTabBaseTable;  // MJD
}

export class PolicyTabButton {
    public caption: string;
    public serviceRequestType: ServiceRequestType;
}

export enum PolicyType {
    ANNUITY = 1,
    LIFE = 2
}
export enum TextAlign {
    Left = 1,
    Center = 2,
    Right = 3
}
export enum TableAlignment {
    Left = 1,
    Right = 2
}
export class PolicyTabBaseTable {
    public policyTabBaseTableRows: PolicyTabBaseTableRow[];
}

export class PolicyTabBaseTableRow {
    public rowIndex: number;

    public isFullWidth: boolean;

    public policyTabBaseTableColumns: PolicyTabBaseTableColumn[];
}

export class PolicyTabBaseTableColumn {
    public columnIndex: number;
    public policyTabInnerTables: PolicyTabInnerTable[];
}
export class PolicyTabInnerTable {
    public header: TableHeader[];

    public order: number;

    public tabColumnIndex: number;

    public rows: PolicyTabInnerTableRow[];
}

export class PolicyTabInnerTableRow {
    public cells: PolicyTabInnerTableRowCell[];
}

export class TableHeader {
    public headerCells: PolicyTabInnerTableRowCell[];
}

export class PolicyTabInnerTableRowCell {
    public index: number;
    public fieldProperty: DynamicField
}
