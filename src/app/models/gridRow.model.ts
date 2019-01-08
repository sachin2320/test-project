import { GridDataModel } from "app/models/gridData.model";

export class GridRowModel {
    constructor(public columns: GridDataModel[],
        public cssClasses: string = "") { }
}